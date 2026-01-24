export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

export const BCRYPT_ROUNDS = 12;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const AD_PLATFORMS = [
  'GOOGLE_ADS',
  'META',
  'LINKEDIN',
  'AMAZON',
  'REDDIT',
  'TWITTER',
  'TIKTOK',
] as const;

export const CAMPAIGN_OBJECTIVES = [
  'AWARENESS',
  'TRAFFIC',
  'ENGAGEMENT',
  'LEADS',
  'APP_PROMOTION',
  'SALES',
] as const;

export const METRIC_AGGREGATIONS = {
  DAILY: 'day',
  WEEKLY: 'week',
  MONTHLY: 'month',
} as const;

export const AI_MODELS = {
  GEMINI_PRO: 'gemini-1.5-pro',
  GEMINI_FLASH: 'gemini-1.5-flash',
} as const;

export const AUTOMATION_LIMITS = {
  MAX_RULES_PER_WORKSPACE: 50,
  MAX_DAILY_EXECUTIONS: 100,
  DEFAULT_COOLDOWN_HOURS: 6,
  MAX_BUDGET_CHANGE_PERCENT: 50,
} as const;

export const PREDICTION_CONFIG = {
  MIN_DATA_DAYS: 14,
  CONFIDENCE_THRESHOLD: 0.7,
  TIMEFRAMES: ['24h', '48h', '72h', '7d'] as const,
} as const;
