import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validateBody } from '@/middleware/validate';
import * as workspaceHandlers from './workspace.handlers';
import { createWorkspaceSchema, updateWorkspaceSchema, inviteMemberSchema } from './workspace.schema';

const router = Router();

router.use(authenticate);

router.post('/', validateBody(createWorkspaceSchema), workspaceHandlers.create);
router.get('/', workspaceHandlers.list);
router.get('/:workspaceId', workspaceHandlers.get);
router.patch('/:workspaceId', validateBody(updateWorkspaceSchema), workspaceHandlers.update);
router.delete('/:workspaceId', workspaceHandlers.remove);

// Members
router.post('/:workspaceId/members', validateBody(inviteMemberSchema), workspaceHandlers.inviteMember);
router.delete('/:workspaceId/members/:userId', workspaceHandlers.removeMember);

export default router;
