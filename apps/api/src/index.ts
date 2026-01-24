import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { env } from '@/config/env.js';
import { API_PREFIX } from '@/config/constants.js';
import { prisma, disconnectDb } from '@/db/client.js';
import { errorHandler, notFoundHandler } from '@/middleware/error-handler.js';

// Import routes
import authRoutes from '@/modules/auth/auth.routes.js';
import userRoutes from '@/modules/users/user.routes.js';
import workspaceRoutes from '@/modules/workspaces/workspace.routes.js';
import adAccountRoutes from '@/modules/ad-accounts/ad-account.routes.js';
import campaignRoutes from '@/modules/campaigns/campaign.routes.js';
import analyticsRoutes from '@/modules/analytics/analytics.routes.js';
import chatRoutes from '@/modules/ai-chat/chat.routes.js';
import recommendationRoutes from '@/modules/ai-recommendations/recommendation.routes.js';
import automationRoutes from '@/modules/automation/automation.routes.js';
import predictionRoutes from '@/modules/predictions/prediction.routes.js';
import competitorRoutes from '@/modules/competitors/competitor.routes.js';
import journeyRoutes from '@/modules/journeys/journey.routes.js';
import creativeRoutes from '@/modules/ai-creative/creative.routes.js';
import reportRoutes from '@/modules/reports/report.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/workspaces`, workspaceRoutes);
app.use(`${API_PREFIX}/accounts`, adAccountRoutes);
app.use(`${API_PREFIX}/campaigns`, campaignRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);
app.use(`${API_PREFIX}/chat`, chatRoutes);
app.use(`${API_PREFIX}/recommendations`, recommendationRoutes);
app.use(`${API_PREFIX}/automations`, automationRoutes);
app.use(`${API_PREFIX}/predictions`, predictionRoutes);
app.use(`${API_PREFIX}/competitors`, competitorRoutes);
app.use(`${API_PREFIX}/journeys`, journeyRoutes);
app.use(`${API_PREFIX}/creative`, creativeRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  await disconnectDb();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`API available at http://localhost:${env.PORT}${API_PREFIX}`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
