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
  },
  {
    title: 'CPA',
    value: '$24.50',
    change: -8.3,
    trend: 'down',
    icon: Target,
    description: 'Cost per acquisition',
  },
  {
    title: 'CTR',
    value: '3.8%',
    change: 5.2,
    trend: 'up',
    icon: MousePointer,
    description: 'Click-through rate',
  },
  {
    title: 'Total Spend',
    value: '$48,250',
    change: 15.7,
    trend: 'up',
    icon: Wallet,
    description: 'Last 30 days',
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
    color: 'bg-primary/90',
  },
  {
    title: 'View Analytics',
    description: 'Deep dive into your metrics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    color: 'bg-slate-600',
  },
  {
    title: 'Automation Rules',
    description: 'Set up auto-optimization',
    icon: Zap,
    href: '/dashboard/automation',
    color: 'bg-emerald-600/90',
  },
  {
    title: 'Settings',
    description: 'Configure your workspace',
    icon: Settings2,
    href: '/dashboard/settings',
    color: 'bg-slate-500',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your ad performance.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask AI for Insights
          </Link>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={cn(
                    'inline-flex items-center',
                    metric.trend === 'up' && metric.title !== 'CPA'
                      ? 'text-green-600'
                      : metric.trend === 'down' && metric.title === 'CPA'
                      ? 'text-green-600'
                      : 'text-red-600'
                  )}
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {metric.change > 0 ? '+' : ''}
                  {metric.change}%
                </span>{' '}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            ROAS and spend trends over the last 10 weeks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}x`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="roas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
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
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>
                  Latest suggestions to improve performance
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/recommendations">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    'rounded-lg p-2',
                    rec.priority === 'high'
                      ? 'bg-red-500/10 text-red-400'
                      : rec.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-primary/10 text-primary'
                  )}
                >
                  <rec.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">{rec.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {rec.impact}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className="group flex items-start gap-4 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
              >
                <div className={cn('rounded-lg p-2 text-white', action.color)}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium group-hover:text-primary">
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
