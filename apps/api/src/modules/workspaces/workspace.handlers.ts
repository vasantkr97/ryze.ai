import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendNoContent } from '@/lib/utils/response';
import { AppError } from '@/middleware/error-handler';
import * as workspaceService from './workspace.service';
import type { CreateWorkspaceInput, UpdateWorkspaceInput, InviteMemberInput } from './workspace.schema';

export const create = async (
  req: Request<unknown, unknown, CreateWorkspaceInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const workspace = await workspaceService.createWorkspace(req.user.id, req.body);
    sendCreated(res, workspace);
  } catch (error) {
    next(error);
  }
};

export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const workspaces = await workspaceService.getWorkspacesByUser(req.user.id);
    sendSuccess(res, workspaces);
  } catch (error) {
    next(error);
  }
};

export const get = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const workspace = await workspaceService.getWorkspaceById(
      req.params.workspaceId,
      req.user.id
    );
    sendSuccess(res, workspace);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request<{ workspaceId: string }, unknown, UpdateWorkspaceInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const workspace = await workspaceService.updateWorkspace(
      req.params.workspaceId,
      req.user.id,
      req.body
    );
    sendSuccess(res, workspace);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    await workspaceService.deleteWorkspace(req.params.workspaceId, req.user.id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (
  req: Request<{ workspaceId: string }, unknown, InviteMemberInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const member = await workspaceService.inviteMember(
      req.params.workspaceId,
      req.user.id,
      req.body
    );
    sendCreated(res, member);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request<{ workspaceId: string; userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    await workspaceService.removeMember(
      req.params.workspaceId,
      req.user.id,
      req.params.userId
    );
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};
