import { Router } from 'express';
import { validateBody } from '@/middleware/validate';
import { authenticate } from '@/middleware/auth';
import * as authHandlers from './auth.handlers';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.schema';

const router = Router();

// Public routes
router.post('/register', validateBody(registerSchema), authHandlers.register);
router.post('/login', validateBody(loginSchema), authHandlers.login);
router.post('/refresh', validateBody(refreshTokenSchema), authHandlers.refresh);
router.post('/logout', validateBody(refreshTokenSchema), authHandlers.logout);

// Protected routes
router.get('/me', authenticate, authHandlers.me);
router.post('/logout-all', authenticate, authHandlers.logoutAll);

export default router;
