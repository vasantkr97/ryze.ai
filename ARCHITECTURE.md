# RYZE AI - Complete System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              RYZE AI PLATFORM                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐         ┌─────────────────────┐                        │
│  │   WEB APPLICATION   │  HTTP   │    API SERVER       │                        │
│  │   (React + Vite)    │◄──────►│    (Express.js)     │                        │
│  │   Port: 5173        │         │    Port: 3001       │                        │
│  └─────────────────────┘         └──────────┬──────────┘                        │
│                                              │                                   │
│                          ┌───────────────────┼───────────────────┐              │
│                          │                   │                   │              │
│                          ▼                   ▼                   ▼              │
│                   ┌────────────┐     ┌────────────┐     ┌────────────┐         │
│                   │ PostgreSQL │     │  Google    │     │ Ad Platform│         │
│                   │  (Prisma)  │     │  Gemini AI │     │   OAuth    │         │
│                   └────────────┘     └────────────┘     └────────────┘         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Monorepo Structure

```
ryze-ai-Claude/
├── apps/
│   ├── api/                 # Backend Express server
│   │   ├── src/
│   │   │   ├── config/      # Environment & constants
│   │   │   ├── db/          # Prisma client singleton
│   │   │   ├── lib/         # Utilities (JWT, hash, AI)
│   │   │   ├── middleware/  # Auth, validation, errors
│   │   │   └── modules/     # Feature modules (REST endpoints)
│   │   └── prisma/          # Database schema & migrations
│   │
│   └── web/                 # Frontend React application
│       └── src/
│           ├── components/  # UI components (Radix-based)
│           ├── hooks/       # Custom React hooks
│           ├── lib/         # Axios client, utilities
│           ├── pages/       # Route pages
│           └── stores/      # Zustand state stores
│
└── packages/
    └── shared/              # Shared types & Zod schemas
        ├── schemas/         # Validation schemas
        └── types/           # TypeScript interfaces
```

**Technology Stack:**
| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5.4, TypeScript 5.5+ |
| Styling | Tailwind CSS 3.4, Radix UI |
| State | Zustand (auth), React Query (server) |
| Backend | Express 4.19, Node.js 18+ |
| Database | PostgreSQL, Prisma ORM v7 |
| AI | Google Gemini via LangChain |
| Package Manager | Bun |

---

## 2. Frontend Architecture

### Component Hierarchy

```
<BrowserRouter>
└── <QueryClientProvider>           # React Query context
    └── <App>                       # Route definitions
        ├── <MarketingLayout>       # Public pages wrapper
        │   ├── <Landing />
        │   ├── <Login />
        │   └── <Register />
        │
        └── <ProtectedRoute>        # Auth guard
            └── <DashboardLayout>   # Authenticated wrapper
                ├── <Sidebar />     # Navigation
                └── <Outlet />      # Page content
                    ├── <Dashboard />
                    ├── <Accounts />
                    ├── <Campaigns />
                    ├── <Analytics />
                    ├── <Chat />
                    ├── <Automation />
                    ├── <Predictions />
                    ├── <Competitors />
                    ├── <CreativeLab />
                    └── <Settings />
```

### State Management Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                        ZUSTAND AUTH STORE                          │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ State: user, accessToken, refreshToken, workspaces,          │ │
│  │        currentWorkspaceId, isAuthenticated, isLoading        │ │
│  │                                                               │ │
│  │ Actions: login(), register(), logout(), refreshAccessToken(),│ │
│  │          fetchUserProfile(), setCurrentWorkspace()           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                              │                                     │
│                              ▼ Persisted to                        │
│                    localStorage["ryze-auth"]                       │
└────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                      REACT QUERY CACHE                             │
│  Server state: campaigns, analytics, recommendations, chat...      │
│  Config: 5min stale time, 1 retry, automatic refetch              │
└────────────────────────────────────────────────────────────────────┘
```

### HTTP Client (Axios) Interceptors

```
Request Flow:
┌──────────┐    ┌─────────────────────┐    ┌──────────┐
│ Component│───►│ Request Interceptor │───►│ API      │
└──────────┘    │                     │    │ Server   │
                │ 1. Get auth from    │    └──────────┘
                │    localStorage     │
                │ 2. Add Bearer token │
                │ 3. Add workspace ID │
                └─────────────────────┘

Response Flow (401 Error):
┌──────────┐    ┌─────────────────────┐    ┌──────────┐
│ API      │───►│ Response Interceptor│───►│ Component│
│ Server   │    │                     │    └──────────┘
└──────────┘    │ 1. Detect 401       │
                │ 2. Call /auth/refresh│
                │ 3. Update tokens    │
                │ 4. Retry request    │
                │ OR logout on failure│
                └─────────────────────┘
```

---

## 3. Backend Architecture

### Request Processing Pipeline

```
Incoming Request
      │
      ▼
┌─────────────────┐
│   Helmet        │  Security headers
├─────────────────┤
│   CORS          │  Origin validation
├─────────────────┤
│   Rate Limiter  │  100 req/15min per IP
├─────────────────┤
│   Body Parser   │  JSON (10MB limit)
├─────────────────┤
│   Cookie Parser │  Session cookies
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│            ROUTE HANDLERS               │
│                                         │
│  /api/v1/auth/*      → Auth Module      │
│  /api/v1/users/*     → Users Module     │
│  /api/v1/workspaces/*→ Workspaces       │
│  /api/v1/accounts/*  → Ad Accounts      │
│  /api/v1/campaigns/* → Campaigns        │
│  /api/v1/analytics/* → Analytics        │
│  /api/v1/chat/*      → AI Chat          │
│  /api/v1/automations/*→ Automation      │
│  /api/v1/predictions/*→ Predictions     │
│  /api/v1/competitors/*→ Competitors     │
│  /api/v1/creative/*  → Creative Lab     │
│  /api/v1/reports/*   → Reports          │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Error Handler   │  Centralized errors
└─────────────────┘
```

### Module Pattern

Each feature follows a consistent structure:

```
modules/{feature}/
├── {feature}.routes.ts     # Express Router definitions
├── {feature}.handlers.ts   # Request/Response handlers
├── {feature}.service.ts    # Business logic (pure functions)
└── {feature}.schema.ts     # Zod validation schemas
```

**Data flow within a module:**

```
Route → Middleware → Handler → Service → Prisma → Database
                        │
                        └──► Response Utility → Client
```

### Middleware Chain

```typescript
// Protected route example
router.get('/protected-resource',
  authenticate,           // 1. Verify JWT, set req.user
  requireWorkspace,       // 2. Verify workspace access, set req.workspaceId
  requireRole('ADMIN'),   // 3. Check role permissions
  validateBody(schema),   // 4. Validate request body
  handler                 // 5. Execute business logic
);
```

---

## 4. Authentication & Authorization

### Token-Based Auth Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  REGISTRATION                                                        │
│  ┌────────┐  email/pass  ┌────────┐  hash pwd   ┌────────┐         │
│  │ Client │────────────►│ Server │────────────►│   DB   │         │
│  └────────┘              └────────┘  create user└────────┘         │
│      ▲                       │       + workspace                    │
│      └───────────────────────┘                                      │
│           tokens + user                                              │
│                                                                      │
│  LOGIN                                                               │
│  ┌────────┐  credentials  ┌────────┐  verify    ┌────────┐         │
│  │ Client │─────────────►│ Server │───────────►│   DB   │         │
│  └────────┘               └────────┘            └────────┘         │
│      ▲                       │                      │               │
│      │    access token       │  store refresh      │               │
│      │    (15min exp)        │  token record       │               │
│      │    refresh token      │◄─────────────────────                │
│      │    (7day exp)         │                                      │
│      └───────────────────────┘                                      │
│                                                                      │
│  TOKEN REFRESH                                                       │
│  ┌────────┐ refresh token ┌────────┐  validate  ┌────────┐         │
│  │ Client │─────────────►│ Server │───────────►│   DB   │         │
│  └────────┘               └────────┘            └────────┘         │
│      ▲                       │                      │               │
│      │   new tokens          │  delete old token   │               │
│      │                       │  create new record  │               │
│      └───────────────────────┘◄─────────────────────                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

```
┌────────────────────────────────────────────────────────────────┐
│                     WORKSPACE RBAC                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User ──── WorkspaceMember ──── Workspace                      │
│                  │                                              │
│                  │ role: OWNER | ADMIN | MEMBER | VIEWER       │
│                  │                                              │
│  ┌──────────────┴───────────────────────────────────────────┐  │
│  │ OWNER  │ Full access, delete workspace, transfer owner   │  │
│  ├─────────────────────────────────────────────────────────-┤  │
│  │ ADMIN  │ Invite/remove members, manage settings          │  │
│  ├─────────────────────────────────────────────────────────-┤  │
│  │ MEMBER │ View and manage campaigns, data                 │  │
│  ├─────────────────────────────────────────────────────────-┤  │
│  │ VIEWER │ Read-only access                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 5. Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE ENTITIES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐     ┌─────────────────┐     ┌────────────┐                   │
│  │   User   │◄───►│ WorkspaceMember │◄───►│ Workspace  │                   │
│  └────┬─────┘     └─────────────────┘     └─────┬──────┘                   │
│       │                                          │                          │
│       │                                          │                          │
│  ┌────▼─────┐                            ┌──────▼───────┐                   │
│  │ Refresh  │                            │  AdAccount   │                   │
│  │  Token   │                            └──────┬───────┘                   │
│  └──────────┘                                   │                           │
│                                                 │                           │
│                              ┌──────────────────┼──────────────────┐       │
│                              │                  │                  │        │
│                         ┌────▼────┐       ┌─────▼─────┐     ┌─────▼─────┐  │
│                         │Campaign │       │ AdMetric  │     │  AdGroup  │  │
│                         └────┬────┘       └───────────┘     └─────┬─────┘  │
│                              │                                     │        │
│                              │                               ┌─────▼─────┐  │
│                              │                               │    Ad     │  │
│                              │                               └───────────┘  │
│                              │                                              │
│  ┌────────────────────────────┴─────────────────────────────────────────┐  │
│  │                         AI & INSIGHTS                                 │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────┐   │  │
│  │  │ ChatSession   │  │Recommendation │  │ CreativeAnalysis        │   │  │
│  │  │   └─Messages  │  │               │  │                         │   │  │
│  │  └───────────────┘  └───────────────┘  └─────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         AUTOMATION                                    │  │
│  │  ┌────────────────┐      ┌─────────────────────┐                     │  │
│  │  │ AutomationRule │─────►│ AutomationExecution │                     │  │
│  │  └────────────────┘      └─────────────────────┘                     │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      COMPETITIVE INTEL                                │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌───────────────┐                 │  │
│  │  │ Competitor │─►│CompetitorAd  │  │ CompetitorSnapshot             │  │
│  │  │            │─►│CompetitorInsight                                  │  │
│  │  └────────────┘  └──────────────┘  └───────────────┘                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      JOURNEY TRACKING                                 │  │
│  │  ┌────────────┐      ┌────────────┐                                  │  │
│  │  │  Visitor   │─────►│ Touchpoint │ (Attribution models)            │  │
│  │  └────────────┘      └────────────┘                                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Model Relationships

| Parent | Child | Relationship | Description |
|--------|-------|--------------|-------------|
| User | RefreshToken | 1:N | User can have multiple active sessions |
| User | WorkspaceMember | 1:N | User can belong to multiple workspaces |
| Workspace | WorkspaceMember | 1:N | Workspace has multiple members |
| Workspace | AdAccount | 1:N | Workspace owns ad accounts |
| AdAccount | Campaign | 1:N | Account contains campaigns |
| Campaign | AdGroup | 1:N | Campaign has ad groups |
| AdGroup | Ad | 1:N | Ad group contains ads |
| Workspace | ChatSession | 1:N | Workspace has chat sessions |
| ChatSession | ChatMessage | 1:N | Session contains messages |
| Workspace | AutomationRule | 1:N | Workspace owns rules |
| AutomationRule | AutomationExecution | 1:N | Rule has execution history |

---

## 6. AI Integration Architecture

### LangChain Agent System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI CHAT SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐                                                        │
│  │ User Query  │                                                        │
│  └──────┬──────┘                                                        │
│         │                                                                │
│         ▼                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CHAT AGENT (LangChain)                        │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ System Prompt                                            │    │   │
│  │  │ - Expert advertising assistant                           │    │   │
│  │  │ - Has access to workspace data via tools                 │    │   │
│  │  │ - Provides actionable recommendations                    │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │                 GOOGLE GEMINI PRO                        │    │   │
│  │  │  Model: gemini-1.5-pro                                   │    │   │
│  │  │  Temperature: 0.3 (deterministic)                        │    │   │
│  │  │  Max Tokens: 2048                                        │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │                    TOOL BELT                             │    │   │
│  │  │  ┌─────────────────┐  ┌─────────────────┐               │    │   │
│  │  │  │ Metrics Tool    │  │ Campaigns Tool  │               │    │   │
│  │  │  │ - ROAS, CPA     │  │ - List/filter   │               │    │   │
│  │  │  │ - CTR, CPC      │  │ - Performance   │               │    │   │
│  │  │  │ - Date ranges   │  │ - Objectives    │               │    │   │
│  │  │  └─────────────────┘  └─────────────────┘               │    │   │
│  │  │  ┌─────────────────┐  ┌─────────────────┐               │    │   │
│  │  │  │ Recommendations │  │ Analysis Tool   │               │    │   │
│  │  │  │ - Generate      │  │ - Deep dive     │               │    │   │
│  │  │  │ - Prioritize    │  │ - Insights      │               │    │   │
│  │  │  └─────────────────┘  └─────────────────┘               │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                           │                                              │
│                           ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │               AGENT EXECUTOR (Max 5 iterations)                  │   │
│  │  1. Receive user query                                           │   │
│  │  2. Decide which tool(s) to call                                 │   │
│  │  3. Execute tool and get results                                 │   │
│  │  4. Synthesize response with workspace data                      │   │
│  │  5. Return natural language answer                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                           │                                              │
│                           ▼                                              │
│  ┌─────────────────┐  OR  ┌─────────────────┐                          │
│  │ Standard Reply  │      │ Streaming (SSE) │                          │
│  │ (JSON response) │      │ (Real-time)     │                          │
│  └─────────────────┘      └─────────────────┘                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### AI Tools Data Access

```
┌──────────────────────────────────────────────────────────────────┐
│                    METRICS TOOL EXAMPLE                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Input: { dateRange: "30d", groupBy: "campaign" }                │
│                          │                                        │
│                          ▼                                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  1. Resolve date range (last 30 days)                      │  │
│  │  2. Query AdMetric table for workspace                     │  │
│  │  3. Aggregate: SUM(spend), SUM(revenue), SUM(clicks)...    │  │
│  │  4. Calculate derived metrics:                             │  │
│  │     - ROAS = revenue / spend                               │  │
│  │     - CPA = spend / conversions                            │  │
│  │     - CTR = clicks / impressions                           │  │
│  │     - CPC = spend / clicks                                 │  │
│  │  5. Group by campaign                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│                          │                                        │
│                          ▼                                        │
│  Output: Structured performance data for AI to interpret         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Feature Flows

### Campaign Analytics Flow

```
┌─────────┐    ┌──────────────┐    ┌────────────┐    ┌──────────┐
│Dashboard│───►│ React Query  │───►│  /analytics│───►│  Prisma  │
│  Page   │    │   (cache)    │    │   endpoint │    │  Query   │
└─────────┘    └──────────────┘    └────────────┘    └────┬─────┘
                     │                                     │
                     │                                     ▼
                     │                              ┌──────────┐
                     │                              │ AdMetric │
                     │                              │  Table   │
                     │                              └────┬─────┘
                     │                                   │
                     ▼                                   │
              ┌──────────────┐    Aggregated Data       │
              │   Recharts   │◄──────────────────────────┘
              │    Render    │   (ROAS, CPA, CTR, trends)
              └──────────────┘
```

### Automation Rule Execution

```
┌────────────────────────────────────────────────────────────────────────┐
│                    AUTOMATION EXECUTION FLOW                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐                                                     │
│  │ Trigger Event │  (ROAS_BELOW_THRESHOLD, BUDGET_DEPLETED, etc.)     │
│  └───────┬───────┘                                                     │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                    GUARDRAILS CHECK                            │    │
│  │  ✓ Max daily executions (100)                                  │    │
│  │  ✓ Budget change limits                                        │    │
│  │  ✓ Excluded campaigns                                          │    │
│  │  ✓ Time-based restrictions                                     │    │
│  └───────────────────────────────────────────────────────────────┘    │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                    EXECUTION MODE                              │    │
│  │                                                                │    │
│  │  AUTO ────────► Execute immediately ────► Log result          │    │
│  │                                                                │    │
│  │  APPROVAL ────► Create alert ────► Wait for approval ────►    │    │
│  │                                     Execute if approved        │    │
│  │                                                                │    │
│  │  NOTIFY ──────► Send notification ────► No action taken       │    │
│  └───────────────────────────────────────────────────────────────┘    │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                 AutomationExecution Record                     │    │
│  │  - rule_id, triggered_at, status, result, metrics_before/after │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Chat Session Flow

```
User                    Frontend                 Backend                    AI
 │                         │                        │                        │
 │  Type message           │                        │                        │
 │────────────────────────►│                        │                        │
 │                         │  POST /chat/message    │                        │
 │                         │───────────────────────►│                        │
 │                         │                        │  Save user message     │
 │                         │                        │─────────┐              │
 │                         │                        │◄────────┘              │
 │                         │                        │                        │
 │                         │                        │  Load chat history     │
 │                         │                        │  (last 20 messages)    │
 │                         │                        │─────────┐              │
 │                         │                        │◄────────┘              │
 │                         │                        │                        │
 │                         │                        │  runAIChat()           │
 │                         │                        │───────────────────────►│
 │                         │                        │                        │
 │                         │                        │     Tool calls         │
 │                         │                        │◄─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
 │                         │                        │     (metrics, etc)     │
 │                         │                        │─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─►│
 │                         │                        │                        │
 │                         │                        │     Final response     │
 │                         │                        │◄───────────────────────│
 │                         │                        │                        │
 │                         │                        │  Save AI message       │
 │                         │                        │─────────┐              │
 │                         │                        │◄────────┘              │
 │                         │      Response          │                        │
 │                         │◄───────────────────────│                        │
 │  Display message        │                        │                        │
 │◄────────────────────────│                        │                        │
 │                         │                        │                        │
```

---

## 8. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  NETWORK LAYER                                                          │
│  ├── CORS: Restricted to FRONTEND_URL                                   │
│  ├── Rate Limiting: 100 req / 15 min per IP                            │
│  └── Helmet: Security headers (XSS, clickjacking, etc.)                │
│                                                                          │
│  AUTHENTICATION LAYER                                                    │
│  ├── JWT Access Tokens: 15-minute expiry                                │
│  ├── JWT Refresh Tokens: 7-day expiry, stored in DB                    │
│  ├── Bcrypt Password Hashing: 12 rounds                                │
│  └── Automatic Token Refresh: Seamless UX                              │
│                                                                          │
│  AUTHORIZATION LAYER                                                     │
│  ├── Workspace Isolation: All data scoped to workspace                 │
│  ├── Role-Based Access: OWNER > ADMIN > MEMBER > VIEWER                │
│  └── Middleware Chain: authenticate → requireWorkspace → requireRole   │
│                                                                          │
│  DATA LAYER                                                              │
│  ├── Prisma ORM: Parameterized queries (SQL injection prevention)      │
│  ├── Input Validation: Zod schemas on all inputs                       │
│  └── React XSS: Automatic escaping                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Ad Platform Integrations

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SUPPORTED PLATFORMS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Google Ads │  │    Meta    │  │  LinkedIn  │  │ Amazon Ads │        │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘        │
│         │               │               │               │               │
│         └───────────────┴───────┬───────┴───────────────┘               │
│                                 │                                        │
│                                 ▼                                        │
│                    ┌────────────────────────┐                           │
│                    │      AdAccount         │                           │
│                    │  - platform            │                           │
│                    │  - platformAccountId   │                           │
│                    │  - accessToken         │                           │
│                    │  - refreshToken        │                           │
│                    │  - tokenExpiresAt      │                           │
│                    └────────────────────────┘                           │
│                                 │                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Reddit   │  │  Twitter   │  │   TikTok   │  │  (Future)  │        │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Shared Package Architecture

```
packages/shared/
├── schemas/
│   ├── auth.ts          # login, register, refresh
│   ├── workspace.ts     # create, update, invite
│   ├── chat.ts          # message, session
│   ├── analytics.ts     # date ranges, filters
│   ├── automation.ts    # rule validation
│   └── ...
│
└── types/
    ├── user.ts          # User, Profile
    ├── workspace.ts     # Workspace, Member, Role
    ├── campaign.ts      # Campaign, AdGroup, Ad
    ├── metrics.ts       # AdMetric, aggregations
    ├── ai.ts            # ChatSession, ChatMessage
    └── api.ts           # ApiResponse<T> wrapper
```

**Import pattern:**
```typescript
// Frontend
import { loginSchema } from '@shared/schemas';
import type { User, Workspace } from '@shared/types';

// Backend
import { loginSchema } from '@shared/schemas';
import type { User, Workspace } from '@shared/types';
```

---

## 11. Configuration Summary

| Variable | Purpose | Default |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | Required |
| `JWT_SECRET` | Access token signing | Required (32+ chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing | Required (32+ chars) |
| `JWT_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `GOOGLE_AI_API_KEY` | Gemini API access | Required |
| `PORT` | API server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` |

---

## 12. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Monorepo** | Shared types prevent drift, unified tooling |
| **Functional modules** | Pure functions, easier testing, no class overhead |
| **Zustand + React Query** | Minimal boilerplate, separation of auth vs server state |
| **Workspace-scoped data** | Multi-tenancy, data isolation, team collaboration |
| **Refresh token in DB** | Revocable sessions, multi-device support |
| **LangChain agents** | Extensible tool system, streaming support |
| **Zod schemas** | Runtime validation, TypeScript inference |
| **Prisma ORM** | Type-safe queries, migrations, relations |

---

## Quick Reference: Request Lifecycle

```
Browser → Vite Proxy → Express → Middleware → Handler → Service → Prisma → PostgreSQL
   │                                                                           │
   │                                                                           │
   └──────────────────────── JSON Response ◄───────────────────────────────────┘
```

**Standard response format:**
```typescript
{
  success: true,
  data: T,
  meta?: { page, limit, total, totalPages }
}
```

**Error response format:**
```typescript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message",
    details?: any
  }
}
```

---

## 13. Complete API Endpoints Reference

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create account + default workspace |
| POST | `/login` | No | Authenticate, receive tokens |
| POST | `/refresh` | No | Exchange refresh token for new tokens |
| POST | `/logout` | Yes | Invalidate current refresh token |
| POST | `/logout-all` | Yes | Invalidate all user sessions |
| GET | `/me` | Yes | Get current user profile |

### Workspaces (`/api/v1/workspaces`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | Yes | - | List user's workspaces |
| POST | `/` | Yes | - | Create new workspace |
| GET | `/:id` | Yes | Member | Get workspace details |
| PATCH | `/:id` | Yes | Admin | Update workspace settings |
| DELETE | `/:id` | Yes | Owner | Delete workspace |
| POST | `/:id/members` | Yes | Admin | Invite member |
| DELETE | `/:id/members/:userId` | Yes | Admin | Remove member |

### Ad Accounts (`/api/v1/accounts`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List connected ad accounts |
| POST | `/` | Yes | Connect new ad account |
| GET | `/:id` | Yes | Get account details |
| PATCH | `/:id` | Yes | Update account settings |
| DELETE | `/:id` | Yes | Disconnect account |
| POST | `/:id/sync` | Yes | Trigger data sync |

### Campaigns (`/api/v1/campaigns`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List campaigns (with filters) |
| GET | `/:id` | Yes | Get campaign details |
| GET | `/:id/metrics` | Yes | Get campaign performance |
| PATCH | `/:id/status` | Yes | Update campaign status |

### Analytics (`/api/v1/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/overview` | Yes | Dashboard overview metrics |
| GET | `/performance` | Yes | Detailed performance data |
| GET | `/trends` | Yes | Historical trend analysis |
| GET | `/breakdown` | Yes | Breakdown by dimension |

### AI Chat (`/api/v1/chat`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/workspaces/:wid/sessions` | Yes | Create chat session |
| GET | `/workspaces/:wid/sessions` | Yes | List sessions |
| POST | `/workspaces/:wid/message` | Yes | Send message (sync) |
| POST | `/workspaces/:wid/message/stream` | Yes | Send message (SSE stream) |
| GET | `/sessions/:sessionId` | Yes | Get session with messages |
| DELETE | `/sessions/:sessionId` | Yes | Delete session |

### Automation (`/api/v1/automations`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rules` | Yes | List automation rules |
| POST | `/rules` | Yes | Create new rule |
| GET | `/rules/:id` | Yes | Get rule details |
| PATCH | `/rules/:id` | Yes | Update rule |
| DELETE | `/rules/:id` | Yes | Delete rule |
| POST | `/rules/:id/toggle` | Yes | Enable/disable rule |
| GET | `/executions` | Yes | List execution history |

### Recommendations (`/api/v1/ai-recommendations`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List AI recommendations |
| GET | `/:id` | Yes | Get recommendation details |
| POST | `/:id/apply` | Yes | Apply recommendation |
| POST | `/:id/dismiss` | Yes | Dismiss recommendation |

### Predictions (`/api/v1/predictions`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List predictions |
| GET | `/forecast` | Yes | Get performance forecast |
| POST | `/generate` | Yes | Generate new predictions |

### Competitors (`/api/v1/competitors`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List tracked competitors |
| POST | `/` | Yes | Add competitor |
| GET | `/:id` | Yes | Get competitor details |
| DELETE | `/:id` | Yes | Remove competitor |
| GET | `/:id/ads` | Yes | Get competitor ads |
| GET | `/:id/insights` | Yes | Get competitor insights |

### Creative Lab (`/api/v1/creative`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Yes | List generated creatives |
| POST | `/generate` | Yes | Generate new creative |
| GET | `/:id` | Yes | Get creative details |
| POST | `/:id/variations` | Yes | Generate variations |

---

## 14. Frontend Pages Architecture

### Page Component Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       PAGE COMPONENT PATTERN                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        PAGE COMPONENT                            │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ Hooks Layer                                              │    │   │
│  │  │  • useAuthStore() - Auth state                          │    │   │
│  │  │  • useQuery() - Server data fetching                    │    │   │
│  │  │  • useMutation() - Server data mutations                │    │   │
│  │  │  • useState() - Local UI state                          │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ Render Layer                                             │    │   │
│  │  │  • Loading states (skeletons)                           │    │   │
│  │  │  • Error boundaries                                      │    │   │
│  │  │  • Main content                                          │    │   │
│  │  │  • Modals/Dialogs                                        │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Dashboard Pages Detail

| Page | Route | Primary Data | Key Features |
|------|-------|--------------|--------------|
| **Dashboard** | `/dashboard` | Analytics overview | KPI cards, trend charts, quick actions |
| **Accounts** | `/dashboard/accounts` | AdAccount[] | Connect platforms, sync status, account health |
| **Campaigns** | `/dashboard/campaigns` | Campaign[] | List/grid view, filters, bulk actions |
| **Analytics** | `/dashboard/analytics` | AdMetric[] | Date range picker, charts, export |
| **Chat** | `/dashboard/chat` | ChatSession[] | Real-time messaging, streaming responses |
| **Automation** | `/dashboard/automation` | AutomationRule[] | Rule builder, execution logs, toggles |
| **Predictions** | `/dashboard/predictions` | Prediction[] | Forecast charts, confidence indicators |
| **Competitors** | `/dashboard/competitors` | Competitor[] | Add competitors, ad library, insights |
| **Creative Lab** | `/dashboard/creative-lab` | GeneratedCreative[] | AI generation, variations, preview |
| **Reports** | `/dashboard/reports` | Report[] | Templates, scheduling, export |
| **Settings** | `/dashboard/settings` | User, Workspace | Profile, workspace, integrations |

---

## 15. Error Handling Architecture

### Backend Error Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING CHAIN                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                    │
│  │ Route Handler   │                                                    │
│  │                 │──── throw AppError ────┐                          │
│  │                 │──── throw ZodError ────┤                          │
│  │                 │──── throw Error ───────┤                          │
│  └─────────────────┘                        │                          │
│                                              │                          │
│                                              ▼                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    CENTRALIZED ERROR HANDLER                      │  │
│  │                                                                    │  │
│  │  switch(error.type) {                                             │  │
│  │    case AppError:                                                 │  │
│  │      → Use error.statusCode & error.code                         │  │
│  │                                                                    │  │
│  │    case ZodError:                                                 │  │
│  │      → 400 VALIDATION_ERROR + formatted issues                   │  │
│  │                                                                    │  │
│  │    case JsonWebTokenError:                                        │  │
│  │      → 401 INVALID_TOKEN                                         │  │
│  │                                                                    │  │
│  │    case TokenExpiredError:                                        │  │
│  │      → 401 TOKEN_EXPIRED                                         │  │
│  │                                                                    │  │
│  │    case PrismaClientKnownRequestError:                           │  │
│  │      → P2002: 409 DUPLICATE_ENTRY                                │  │
│  │      → P2025: 404 NOT_FOUND                                      │  │
│  │                                                                    │  │
│  │    default:                                                       │  │
│  │      → 500 INTERNAL_ERROR (hide details in production)           │  │
│  │  }                                                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                              │                          │
│                                              ▼                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Response: { success: false, error: { code, message, details } } │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### AppError Class

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,    // HTTP status (400, 401, 404, etc.)
    public code: string,          // Machine-readable (USER_NOT_FOUND)
    public message: string,       // Human-readable description
    public details?: unknown      // Additional context
  ) {}
}

// Usage in handlers:
throw new AppError(404, 'CAMPAIGN_NOT_FOUND', 'Campaign does not exist');
throw new AppError(403, 'INSUFFICIENT_PERMISSIONS', 'Admin role required');
```

### Frontend Error Handling

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FRONTEND ERROR HANDLING                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ React Query Error Handling                                         │  │
│  │                                                                    │  │
│  │  const { data, error, isError } = useQuery({                      │  │
│  │    queryKey: ['campaigns'],                                       │  │
│  │    queryFn: fetchCampaigns,                                       │  │
│  │    retry: 1,                    // Retry once on failure          │  │
│  │    staleTime: 5 * 60 * 1000,    // 5 min cache                   │  │
│  │  });                                                               │  │
│  │                                                                    │  │
│  │  if (isError) {                                                   │  │
│  │    toast.error(error.response?.data?.error?.message);             │  │
│  │  }                                                                 │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Axios Response Interceptor                                         │  │
│  │                                                                    │  │
│  │  401 Error ────► Attempt token refresh                            │  │
│  │       │                │                                           │  │
│  │       │         Success: Retry original request                   │  │
│  │       │         Failure: Clear auth, redirect to /login           │  │
│  │       │                                                            │  │
│  │  Other Errors ────► Pass to calling component                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 16. Data Synchronization Patterns

### Ad Account Data Sync

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AD ACCOUNT SYNC FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐                                                    │
│  │ Trigger Sync    │  (Manual button OR scheduled job)                 │
│  └────────┬────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    FOR EACH AD ACCOUNT                           │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ 1. Check token validity                                    │  │   │
│  │  │    └─ If expired: Use refreshToken to get new accessToken │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ 2. Fetch from Platform API                                 │  │   │
│  │  │    • Campaigns list                                        │  │   │
│  │  │    • Ad groups per campaign                                │  │   │
│  │  │    • Ads per ad group                                      │  │   │
│  │  │    • Metrics (impressions, clicks, spend, conversions)    │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ 3. Upsert to Database                                      │  │   │
│  │  │    • Campaign records (create/update)                      │  │   │
│  │  │    • AdGroup records                                       │  │   │
│  │  │    • Ad records                                            │  │   │
│  │  │    • AdMetric records (daily aggregation)                 │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                           │                                      │   │
│  │                           ▼                                      │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ 4. Update sync status                                      │  │   │
│  │  │    • lastSyncedAt timestamp                               │  │   │
│  │  │    • syncStatus: SUCCESS | FAILED                         │  │   │
│  │  │    • error message if failed                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Real-time Updates (Chat Streaming)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    SSE STREAMING FLOW                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Frontend                          Backend                              │
│      │                                │                                  │
│      │  POST /chat/message/stream     │                                  │
│      │───────────────────────────────►│                                  │
│      │                                │                                  │
│      │  Content-Type: text/event-stream                                 │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"start"}        │                                  │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"token","content":"Hello"}                        │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"token","content":" there"}                       │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"tool_call","tool":"metrics"}                     │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"tool_result","data":{...}}                       │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"token","content":"Based on..."}                  │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│      │  data: {"type":"end","messageId":"..."}                          │
│      │◄───────────────────────────────│                                  │
│      │                                │                                  │
│                                                                          │
│  Frontend handles each event:                                           │
│  • start: Show typing indicator                                         │
│  • token: Append to message display                                     │
│  • tool_call: Show "Analyzing data..."                                  │
│  • tool_result: Optional debug display                                  │
│  • end: Save complete message, hide indicator                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Multi-Tenancy Architecture

### Workspace Isolation Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     MULTI-TENANCY MODEL                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                         USER CONTEXT                              │  │
│  │                                                                    │  │
│  │  User A ──────┬────────► Workspace 1 (Owner)                     │  │
│  │               │                │                                   │  │
│  │               │                ├── AdAccount (Google)             │  │
│  │               │                ├── AdAccount (Meta)               │  │
│  │               │                ├── Campaigns [...]                │  │
│  │               │                ├── ChatSessions [...]             │  │
│  │               │                └── AutomationRules [...]          │  │
│  │               │                                                    │  │
│  │               └────────► Workspace 2 (Member)                     │  │
│  │                               │                                    │  │
│  │                               └── (Read/write based on role)      │  │
│  │                                                                    │  │
│  │  User B ──────┬────────► Workspace 2 (Owner)                     │  │
│  │               │                                                    │  │
│  │               └────────► Workspace 3 (Viewer)                     │  │
│  │                               │                                    │  │
│  │                               └── (Read-only access)              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  DATA ISOLATION ENFORCEMENT                                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  Every query includes workspace filter:                           │  │
│  │                                                                    │  │
│  │  prisma.campaign.findMany({                                       │  │
│  │    where: {                                                        │  │
│  │      adAccount: {                                                  │  │
│  │        workspaceId: req.workspaceId  // Always filtered          │  │
│  │      }                                                             │  │
│  │    }                                                               │  │
│  │  });                                                               │  │
│  │                                                                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Workspace Context Flow

```
Request with x-workspace-id header
          │
          ▼
┌─────────────────────────┐
│ requireWorkspace()      │
│                         │
│ 1. Extract workspaceId  │
│    from header/params   │
│                         │
│ 2. Query membership:    │
│    SELECT * FROM        │
│    WorkspaceMember      │
│    WHERE userId = ?     │
│    AND workspaceId = ?  │
│                         │
│ 3. If not member:       │
│    403 Forbidden        │
│                         │
│ 4. Attach to request:   │
│    req.workspaceId      │
│    req.workspaceRole    │
└────────────┬────────────┘
             │
             ▼
    Handler uses req.workspaceId
    for all database queries
```

---

## 18. Performance Considerations

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       CACHING LAYERS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FRONTEND (React Query)                                                 │
│  ├── staleTime: 5 minutes                                               │
│  ├── cacheTime: 30 minutes                                              │
│  ├── Automatic background refetch on window focus                       │
│  └── Optimistic updates for mutations                                   │
│                                                                          │
│  BACKEND (Future considerations)                                        │
│  ├── Redis for session storage                                          │
│  ├── Redis for rate limiting counters                                   │
│  ├── Cached aggregations for dashboard                                  │
│  └── Platform API response caching                                      │
│                                                                          │
│  DATABASE                                                                │
│  ├── Prisma connection pooling                                          │
│  ├── Indexed columns: userId, workspaceId, date, platformAccountId     │
│  └── Composite indexes for common query patterns                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Query Optimization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DATABASE INDEXES                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  RefreshToken                                                           │
│  ├── @@index([userId])           - Fast lookup by user                 │
│  └── @@index([expiresAt])        - Cleanup expired tokens              │
│                                                                          │
│  WorkspaceMember                                                        │
│  └── @@unique([workspaceId, userId]) - Membership checks               │
│                                                                          │
│  AdMetric                                                                │
│  ├── @@index([date])             - Date range queries                  │
│  ├── @@index([adAccountId])      - Account filtering                   │
│  └── @@index([campaignId])       - Campaign filtering                  │
│                                                                          │
│  Campaign                                                                │
│  ├── @@index([adAccountId])      - List by account                     │
│  └── @@index([status])           - Filter by status                    │
│                                                                          │
│  ChatMessage                                                             │
│  └── @@index([sessionId, createdAt]) - Ordered message retrieval       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Deployment Architecture

### Development Environment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Terminal 1: bun run dev (api)     │  Terminal 2: bun run dev (web)    │
│  ┌──────────────────────────────┐  │  ┌──────────────────────────────┐ │
│  │ Express Server               │  │  │ Vite Dev Server              │ │
│  │ Port: 3001                   │◄─┼──│ Port: 5173                   │ │
│  │                              │  │  │ Proxy: /api → :3001          │ │
│  │ Hot reload via nodemon      │  │  │ HMR enabled                   │ │
│  └──────────────┬───────────────┘  │  └──────────────────────────────┘ │
│                 │                   │                                    │
│                 ▼                   │                                    │
│  ┌──────────────────────────────┐  │                                    │
│  │ PostgreSQL (Docker/Local)   │  │                                    │
│  │ Port: 5432                   │  │                                    │
│  └──────────────────────────────┘  │                                    │
│                                     │                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Production Architecture (Recommended)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION DEPLOYMENT                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                        ┌─────────────────┐                              │
│                        │   CDN (Vercel/  │                              │
│                        │   Cloudflare)   │                              │
│                        └────────┬────────┘                              │
│                                 │                                        │
│            ┌────────────────────┼────────────────────┐                  │
│            │                    │                    │                  │
│            ▼                    ▼                    ▼                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │ Static Assets   │  │ API Gateway/    │  │ WebSocket       │        │
│  │ (React SPA)     │  │ Load Balancer   │  │ (Future)        │        │
│  └─────────────────┘  └────────┬────────┘  └─────────────────┘        │
│                                │                                        │
│                 ┌──────────────┼──────────────┐                        │
│                 │              │              │                        │
│                 ▼              ▼              ▼                        │
│  ┌──────────────────────────────────────────────────────────┐         │
│  │              API Server Instances (Node.js)              │         │
│  │                    (Auto-scaling)                         │         │
│  └───────────────────────────┬──────────────────────────────┘         │
│                              │                                          │
│            ┌─────────────────┼─────────────────┐                       │
│            │                 │                 │                       │
│            ▼                 ▼                 ▼                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│  │ PostgreSQL      │  │ Redis           │  │ Google Gemini   │       │
│  │ (Managed)       │  │ (Sessions/Cache)│  │ API             │       │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 20. File-to-Feature Mapping

### Critical Files Reference

| Feature | Key Files | Purpose |
|---------|-----------|---------|
| **Auth** | `api/src/modules/auth/*` | Login, register, tokens |
| | `web/src/stores/auth-store.ts` | Frontend auth state |
| | `api/src/lib/utils/jwt.ts` | Token generation/verification |
| **Workspaces** | `api/src/modules/workspaces/*` | CRUD, members |
| | `api/src/middleware/auth.ts` | `requireWorkspace()` |
| **AI Chat** | `api/src/modules/chat/*` | Sessions, messages |
| | `api/src/lib/ai/chat-agent.ts` | LangChain agent |
| | `api/src/lib/ai/tools/*` | AI tool implementations |
| | `web/src/pages/dashboard/Chat.tsx` | Chat UI |
| **Automation** | `api/src/modules/automation/*` | Rules, executions |
| | `web/src/pages/dashboard/Automation.tsx` | Rule builder UI |
| **Analytics** | `api/src/modules/analytics/*` | Aggregations |
| | `web/src/pages/dashboard/Analytics.tsx` | Charts, metrics |
| **Database** | `api/prisma/schema.prisma` | All models |
| | `api/src/db/client.ts` | Prisma singleton |
| **Shared** | `packages/shared/schemas/*` | Zod validation |
| | `packages/shared/types/*` | TypeScript types |
| **Config** | `api/src/config/env.ts` | Environment vars |
| | `api/src/config/constants.ts` | App constants |

---

## Summary: How Everything Connects

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM INTERACTION SUMMARY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. USER ACTION                                                             │
│     └─► React Component renders UI                                          │
│         └─► User clicks/types/submits                                       │
│                                                                              │
│  2. STATE UPDATE                                                            │
│     └─► Zustand (auth) OR React Query (server data)                        │
│         └─► Triggers API call via Axios                                     │
│                                                                              │
│  3. REQUEST FLOW                                                            │
│     └─► Axios interceptor adds auth headers                                 │
│         └─► Vite proxy forwards to Express                                  │
│             └─► Middleware chain: security → auth → validation             │
│                 └─► Route handler processes request                         │
│                                                                              │
│  4. BUSINESS LOGIC                                                          │
│     └─► Service function executes logic                                     │
│         └─► Prisma queries/mutations                                        │
│             └─► PostgreSQL stores/retrieves data                            │
│                                                                              │
│  5. AI PROCESSING (if applicable)                                           │
│     └─► LangChain agent receives context                                    │
│         └─► Gemini model processes with tools                               │
│             └─► Tools query workspace data                                  │
│                 └─► Response synthesized                                    │
│                                                                              │
│  6. RESPONSE FLOW                                                           │
│     └─► Handler formats response                                            │
│         └─► JSON returned to frontend                                       │
│             └─► React Query caches result                                   │
│                 └─► Component re-renders with data                          │
│                                                                              │
│  7. ERROR HANDLING (any layer)                                              │
│     └─► Error thrown/caught                                                 │
│         └─► Centralized handler formats                                     │
│             └─► Frontend displays toast/message                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
