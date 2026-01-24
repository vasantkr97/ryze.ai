import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendNoContent } from '@/lib/utils/response';
import { AppError } from '@/middleware/error-handler';
import * as chatService from './chat.service';
import type { SendMessageInput, CreateSessionInput } from './chat.schema';

export const createSession = async (
  req: Request<{ workspaceId: string }, unknown, CreateSessionInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const session = await chatService.createChatSession(
      req.user.id,
      req.params.workspaceId,
      req.body.title
    );
    sendCreated(res, session);
  } catch (error) {
    next(error);
  }
};

export const listSessions = async (
  req: Request<{ workspaceId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const sessions = await chatService.getChatSessions(
      req.params.workspaceId,
      req.user.id
    );
    sendSuccess(res, sessions);
  } catch (error) {
    next(error);
  }
};

export const getSession = async (
  req: Request<{ sessionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    const session = await chatService.getChatSession(
      req.params.sessionId,
      req.user.id
    );
    sendSuccess(res, session);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (
  req: Request<{ workspaceId: string }, unknown, SendMessageInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { message, sessionId } = req.body;

    let response;
    if (sessionId) {
      response = await chatService.processUserMessage(
        sessionId,
        message,
        req.user.id,
        req.params.workspaceId
      );
    } else {
      response = await chatService.sendMessageWithNewSession(
        message,
        req.user.id,
        req.params.workspaceId
      );
    }

    sendSuccess(res, response);
  } catch (error) {
    next(error);
  }
};

export const sendMessageStream = async (
  req: Request<{ workspaceId: string }, unknown, SendMessageInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { message, sessionId } = req.body;

    if (!sessionId) {
      throw new AppError('BAD_REQUEST', 'Session ID required for streaming', 400);
    }

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = chatService.streamUserMessage(
      sessionId,
      message,
      req.user.id,
      req.params.workspaceId
    );

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (
  req: Request<{ sessionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('UNAUTHORIZED', 'Authentication required', 401);
    }
    await chatService.deleteChatSession(req.params.sessionId, req.user.id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};
