import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Target,
  MousePointer,
  Wallet,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  MessageSquare,
  Settings2,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data for performance chart
const performanceData = [
  { date: 'Jan 1', roas: 2.8, spend: 4200, conversions: 145 },
  { date: 'Jan 8', roas: 3.1, spend: 4500, conversions: 162 },
  { date: 'Jan 15', roas: 2.9, spend: 4100, conversions: 138 },
  { date: 'Jan 22', roas: 3.4, spend: 4800, conversions: 189 },
  { date: 'Jan 29', roas: 3.2, spend: 4600, conversions: 175 },
  { date: 'Feb 5', roas: 3.6, spend: 5100, conversions: 210 },
  { date: 'Feb 12', roas: 3.8, spend: 5400, conversions: 228 },
  { date: 'Feb 19', roas: 3.5, spend: 5200, conversions: 195 },
  { date: 'Feb 26', roas: 4.1, spend: 5800, conversions: 267 },
  { date: 'Mar 5', roas: 4.3, spend: 6200, conversions: 298 },
];

// Mock data for metrics
const metrics = [
  {
    title: 'ROAS',
    value: '4.3x',
    change: 12.5,
    trend: 'up',
    icon: TrendingUp,
    description: 'Return on ad spend',
    color: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-500',
    borderColor: 'group-hover:border-emerald-500/30',
  },
  {
    title: 'CPA',
    value: '$24.50',
    change: -8.3,
    trend: 'down',
    icon: Target,
    description: 'Cost per acquisition',
    color: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
    borderColor: 'group-hover:border-blue-500/30',
  },
  {
    title: 'CTR',
    value: '3.8%',
    change: 5.2,
    trend: 'up',
    icon: MousePointer,
    description: 'Click-through rate',
    color: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-500',
    borderColor: 'group-hover:border-violet-500/30',
  },
  {
    title: 'Total Spend',
    value: '$48,250',
    change: 15.7,
    trend: 'up',
    icon: Wallet,
    description: 'Last 30 days',
    color: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-500',
    borderColor: 'group-hover:border-amber-500/30',
  },
];

// Mock data for recommendations
const recommendations = [
  {
    id: 1,
    type: 'optimization',
    priority: 'high',
    title: 'Increase budget for "Summer Sale" campaign',
    description: 'This campaign is performing 45% above average ROAS. Consider increasing budget by 20%.',
    impact: '+$2,400 projected revenue',
    icon: TrendingUp,
  },
  {
    id: 2,
    type: 'warning',
    priority: 'medium',
    title: 'Pause underperforming ad sets',
    description: '3 ad sets in "Brand Awareness" have CPA 2x above target.',
    impact: 'Save $340/day',
    icon: Target,
  },
  {
    id: 3,
    type: 'insight',
    priority: 'low',
    title: 'New audience segment identified',
    description: 'Users aged 25-34 on mobile show 28% higher conversion rate.',
    impact: 'Potential +15% conversions',
    icon: Sparkles,
  },
];

// Quick actions
const quickActions = [
  {
    title: 'Chat with AI',
    description: 'Ask questions about your campaigns',
    icon: MessageSquare,
    href: '/dashboard/chat',
    gradient: 'from-primary to-primary/80',
  },
  {
    title: 'View Analytics',
    description: 'Deep dive into your metrics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    gradient: 'from-blue-600 to-blue-500',
  },
  {
    title: 'Automation Rules',
    description: 'Set up auto-optimization',
    icon: Zap,
    href: '/dashboard/automation',
    gradient: 'from-amber-600 to-amber-500',
  },
  {
    title: 'Settings',
    description: 'Configure your workspace',
    icon: Settings2,
    href: '/dashboard/settings',
    gradient: 'from-slate-600 to-slate-500',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your ad performance.
          </p>
        </div>
        <Button asChild className="btn-premium w-fit">
          <Link to="/dashboard/chat">
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI for Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.title}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
              metric.borderColor
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              metric.color
            )} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 transition-colors group-hover:bg-transparent",
              )}>
                <metric.icon className={cn("h-4 w-4", metric.iconColor)} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium',
                    metric.trend === 'up' && metric.title !== 'CPA'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : metric.trend === 'down' && metric.title === 'CPA'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  )}
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Overview
            </CardTitle>
            <CardDescription>
              ROAS and spend trends over the last 10 weeks
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/analytics">
              View Details
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}x`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px hsl(var(--background) / 0.5)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  itemStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="roas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRoas)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Recommendations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Latest suggestions to improve performance
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/recommendations" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="group flex items-start gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 transition-all duration-200 hover:border-primary/30 hover:bg-muted/40"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                    rec.priority === 'high'
                      ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
                      : rec.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20'
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  )}
                >
                  <rec.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-tight">{rec.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {rec.description}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {rec.impact}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="group relative flex items-start gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg overflow-hidden"
              >
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform group-hover:scale-110",
                  action.gradient
                )}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
