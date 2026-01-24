import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '@/config/env';
import { sendError } from '@/lib/utils/response';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
    );
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode, err.details);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'INVALID_TOKEN', 'Invalid authentication token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'TOKEN_EXPIRED', 'Authentication token has expired', 401);
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };

    if (prismaError.code === 'P2002') {
      const field = prismaError.meta?.target?.[0] || 'field';
      return sendError(res, 'DUPLICATE_ENTRY', `A record with this ${field} already exists`, 409);
    }

    if (prismaError.code === 'P2025') {
      return sendError(res, 'NOT_FOUND', 'The requested resource was not found', 404);
    }
  }

  // Default error
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  return sendError(res, 'INTERNAL_ERROR', message, 500);
};

export const notFoundHandler = (_req: Request, res: Response): Response => {
  return sendError(res, 'NOT_FOUND', 'The requested endpoint does not exist', 404);
};
