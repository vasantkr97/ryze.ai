import { Router } from 'express';
import { authenticate, requireWorkspace } from '@/middleware/auth.js';
import { validateBody } from '@/middleware/validate.js';
import * as chatHandlers from './chat.handlers.js';
import { sendMessageSchema, createSessionSchema } from './chat.schema.js';

const router = Router();

router.use(authenticate);

// Workspace-scoped routes
router.post(
  '/workspaces/:workspaceId/sessions',
  requireWorkspace,
  validateBody(createSessionSchema),
  chatHandlers.createSession
);

router.get(
  '/workspaces/:workspaceId/sessions',
  requireWorkspace,
  chatHandlers.listSessions
);

router.post(
  '/workspaces/:workspaceId/message',
  requireWorkspace,
  validateBody(sendMessageSchema),
  chatHandlers.sendMessage
);

router.post(
  '/workspaces/:workspaceId/message/stream',
  requireWorkspace,
  validateBody(sendMessageSchema),
  chatHandlers.sendMessageStream
);

// Session-specific routes
router.get('/sessions/:sessionId', chatHandlers.getSession);
router.delete('/sessions/:sessionId', chatHandlers.deleteSession);

export default router;
