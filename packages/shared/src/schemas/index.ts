import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Workspace schemas
export const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(100),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

// Chat schemas
export const sendMessageSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
});

export const createSessionSchema = z.object({
  title: z.string().max(100).optional(),
});

// Analytics schemas
export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  range: z.enum(['7d', '30d', '90d', 'custom']).default('30d'),
});

// Automation schemas
export const createAutomationRuleSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  triggerType: z.enum([
    'CPA_ABOVE_THRESHOLD',
    'ROAS_BELOW_THRESHOLD',
    'SPEND_EXCEEDS_BUDGET',
    'CTR_DROP',
    'CONVERSION_DROP',
    'SCHEDULE',
    'AI_RECOMMENDATION',
  ]),
  triggerConfig: z.record(z.unknown()),
  actionType: z.enum([
    'PAUSE_CAMPAIGN',
    'PAUSE_KEYWORD',
    'ADJUST_BID',
    'ADJUST_BUDGET',
    'ADD_NEGATIVE_KEYWORD',
    'REALLOCATE_BUDGET',
    'ENABLE_CAMPAIGN',
  ]),
  actionConfig: z.record(z.unknown()),
  executionMode: z.enum(['AUTO', 'APPROVAL', 'NOTIFY']).default('APPROVAL'),
  guardrails: z.object({
    maxBudgetChangePercent: z.number().min(0).max(100).optional(),
    maxDailyActions: z.number().min(1).optional(),
    excludedCampaigns: z.array(z.string()).optional(),
    cooldownHours: z.number().min(1).optional(),
  }).optional(),
});

// Competitor schemas
export const addCompetitorSchema = z.object({
  name: z.string().min(2).max(100),
  domain: z.string().min(3),
  trackedKeywords: z.array(z.string()).optional(),
  platforms: z.array(z.enum(['GOOGLE_ADS', 'META', 'LINKEDIN', 'AMAZON', 'REDDIT', 'TWITTER', 'TIKTOK'])).optional(),
});

// Report schemas
export const createReportSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['PERFORMANCE', 'CREATIVE', 'AUDIT', 'CUSTOM']),
  config: z.object({
    dateRange: dateRangeSchema,
    accounts: z.array(z.string()).optional(),
    metrics: z.array(z.string()).optional(),
  }),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type CreateAutomationRuleInput = z.infer<typeof createAutomationRuleSchema>;
export type AddCompetitorInput = z.infer<typeof addCompetitorSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
