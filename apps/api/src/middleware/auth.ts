import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '@/lib/utils/jwt';
import { sendError } from '@/lib/utils/response';
import { prisma } from '@/db/client';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & { id: string };
      workspaceId?: string;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return sendError(res, 'UNAUTHORIZED', 'User not found', 401);
    }

    req.user = {
      ...payload,
      id: user.id,
    };

    next();
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      return sendError(res, 'TOKEN_EXPIRED', 'Access token has expired', 401);
    }
    return sendError(res, 'UNAUTHORIZED', 'Invalid authentication token', 401);
  }
};

export const requireWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const workspaceId = req.params.workspaceId || req.headers['x-workspace-id'] as string;

  if (!workspaceId) {
    return sendError(res, 'BAD_REQUEST', 'Workspace ID is required', 400);
  }

  if (!req.user) {
    return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
  }

  // Verify user is a member of the workspace
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: req.user.id,
      },
    },
  });

  if (!membership) {
    return sendError(res, 'FORBIDDEN', 'You do not have access to this workspace', 403);
  }

  req.workspaceId = workspaceId;
  next();
};

export const requireRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (!req.user || !req.workspaceId) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: req.workspaceId,
          userId: req.user.id,
        },
      },
    });

    if (!membership || !roles.includes(membership.role)) {
      return sendError(res, 'FORBIDDEN', 'Insufficient permissions', 403);
    }

    next();
  };
};
