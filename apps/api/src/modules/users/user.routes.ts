import { Router } from 'express';
import { authenticate } from '@/middleware/auth.js';
import * as userHandlers from './user.handlers.js';

const router = Router();

router.use(authenticate);

router.get('/profile', userHandlers.getProfile);
router.patch('/profile', userHandlers.updateProfile);

export default router;
