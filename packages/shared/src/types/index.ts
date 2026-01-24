// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
}

// Workspace types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  createdAt: string;
}

export type Plan = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: Role;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
}

// Ad Account types
export type AdPlatform =
  | 'GOOGLE_ADS'
  | 'META'
  | 'LINKEDIN'
  | 'AMAZON'
  | 'REDDIT'
  | 'TWITTER'
  | 'TIKTOK';

export type AccountStatus = 'ACTIVE' | 'PAUSED' | 'DISCONNECTED' | 'ERROR';

export interface AdAccount {
  id: string;
  platform: AdPlatform;
  name: string;
  status: AccountStatus;
  lastSyncAt: string | null;
}

// Campaign types
export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT' | 'REMOVED';
export type BudgetType = 'DAILY' | 'LIFETIME';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  objective: string | null;
  budget: number | null;
  budgetType: BudgetType | null;
  platform: AdPlatform;
}

// Metrics types
export interface AdMetrics {
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface MetricsSummary extends AdMetrics {
  period: {
    start: string;
    end: string;
  };
}

// Recommendation types
export type RecommendationType =
  | 'PAUSE_KEYWORD'
  | 'ADD_NEGATIVE_KEYWORD'
  | 'ADJUST_BID'
  | 'BUDGET_REALLOCATION'
  | 'SPLIT_CAMPAIGN'
  | 'FIX_TRACKING'
  | 'CREATIVE_REFRESH'
  | 'AUDIENCE_EXPANSION';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecommendationStatus = 'PENDING' | 'APPLIED' | 'DISMISSED' | 'EXPIRED';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: Priority;
  status: RecommendationStatus;
  title: string;
  description: string;
  impact: string | null;
  impactValue: number | null;
  createdAt: string;
}

// Chat types
export interface ChatSession {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

// Automation types
export type TriggerType =
  | 'CPA_ABOVE_THRESHOLD'
  | 'ROAS_BELOW_THRESHOLD'
  | 'SPEND_EXCEEDS_BUDGET'
  | 'CTR_DROP'
  | 'CONVERSION_DROP'
  | 'SCHEDULE'
  | 'AI_RECOMMENDATION';

export type ActionType =
  | 'PAUSE_CAMPAIGN'
  | 'PAUSE_KEYWORD'
  | 'ADJUST_BID'
  | 'ADJUST_BUDGET'
  | 'ADD_NEGATIVE_KEYWORD'
  | 'REALLOCATE_BUDGET'
  | 'ENABLE_CAMPAIGN';

export type ExecutionMode = 'AUTO' | 'APPROVAL' | 'NOTIFY';
export type RuleStatus = 'ACTIVE' | 'PAUSED' | 'DISABLED';

export interface AutomationRule {
  id: string;
  name: string;
  description: string | null;
  triggerType: TriggerType;
  actionType: ActionType;
  executionMode: ExecutionMode;
  status: RuleStatus;
  lastTriggered: string | null;
}

// Alert types
export type AlertType =
  | 'PREDICTION_WARNING'
  | 'ANOMALY_DETECTED'
  | 'BUDGET_ALERT'
  | 'PERFORMANCE_DROP'
  | 'COMPETITOR_ALERT'
  | 'AUTOMATION_EXECUTED';

export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  type: AlertType;
  severity: Severity;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Competitor types
export interface Competitor {
  id: string;
  name: string;
  domain: string;
  trackedKeywords: string[];
  platforms: AdPlatform[];
  isActive: boolean;
}

// Journey types
export type FunnelStage =
  | 'AWARENESS'
  | 'INTEREST'
  | 'CONSIDERATION'
  | 'INTENT'
  | 'PURCHASE'
  | 'LOYALTY'
  | 'ADVOCACY';

export type Channel =
  | 'PAID_SEARCH'
  | 'PAID_SOCIAL'
  | 'ORGANIC_SEARCH'
  | 'ORGANIC_SOCIAL'
  | 'EMAIL'
  | 'DIRECT'
  | 'REFERRAL'
  | 'DISPLAY';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
