import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '@/middleware/auth.js';
import { sendSuccess, sendCreated, sendNoContent } from '@/lib/utils/response.js';

const router = Router();

router.use(authenticate);

// List all connected ad accounts
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendSuccess(res, { adAccounts: [], message: 'Ad accounts list endpoint - not yet implemented' });
  } catch (error) {
    next(error);
  }
});

// Get a specific ad account
router.get('/:accountId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendSuccess(res, { accountId: req.params.accountId, message: 'Ad account details endpoint - not yet implemented' });
  } catch (error) {
    next(error);
  }
});

// Connect a new ad account (initiate OAuth flow)
router.post('/connect', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendCreated(res, { message: 'Connect ad account endpoint - not yet implemented' });
  } catch (error) {
    next(error);
  }
});

// OAuth callback for ad platform
router.get('/callback/:platform', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendSuccess(res, { platform: req.params.platform, message: 'OAuth callback endpoint - not yet implemented' });
  } catch (error) {
    next(error);
  }
});

// Disconnect an ad account
router.delete('/:accountId', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
});

// Sync ad account data
router.post('/:accountId/sync', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    sendSuccess(res, { accountId: req.params.accountId, message: 'Sync endpoint - not yet implemented' });
  } catch (error) {
    next(error);
  }
});

export default router;
