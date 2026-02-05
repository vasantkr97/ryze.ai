import { useState } from 'react';
import {
  Plus,
  Zap,
  Play,
  Pause,
  Trash2,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle2,
  Power,
  History,
  Edit,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock automation rules
const automationRules = [
  {
    id: 1,
    name: 'Pause Low ROAS Ad Sets',
    description: 'Automatically pause ad sets when ROAS drops below 2.0x for 3 consecutive days',
    trigger: 'ROAS < 2.0x for 3 days',
    action: 'Pause ad set',
    status: 'active',
    platform: 'All Platforms',
    lastTriggered: '2 hours ago',
    timesTriggered: 12,
    savings: 2340,
    icon: TrendingDown,
  },
  {
    id: 2,
    name: 'Increase Budget for Winners',
    description: 'Increase budget by 20% for campaigns with ROAS > 4.0x and budget utilization > 90%',
    trigger: 'ROAS > 4.0x & Budget > 90%',
    action: 'Increase budget by 20%',
    status: 'active',
    platform: 'Google Ads',
    lastTriggered: '1 day ago',
    timesTriggered: 8,
    savings: 0,
    revenueGain: 4500,
    icon: TrendingUp,
  },
  {
    id: 3,
    name: 'CPA Alert',
    description: 'Send alert when CPA exceeds target by more than 50%',
    trigger: 'CPA > Target + 50%',
    action: 'Send Slack notification',
    status: 'active',
    platform: 'Meta Ads',
    lastTriggered: '5 hours ago',
    timesTriggered: 24,
    savings: 0,
    icon: AlertTriangle,
  },
  {
    id: 4,
    name: 'Dayparting Bid Adjustments',
    description: 'Increase bids by 15% during peak conversion hours (7PM - 9PM)',
    trigger: 'Time: 7PM - 9PM',
    action: '+15% bid adjustment',
    status: 'active',
    platform: 'All Platforms',
    lastTriggered: 'Yesterday',
    timesTriggered: 30,
    savings: 0,
    icon: Clock,
  },
  {
    id: 5,
    name: 'Weekly Budget Reset',
    description: 'Reset daily budgets every Monday based on weekly performance',
    trigger: 'Every Monday, 12:00 AM',
    action: 'Recalculate budgets',
    status: 'paused',
    platform: 'All Platforms',
    lastTriggered: '2 weeks ago',
    timesTriggered: 4,
    savings: 0,
    icon: DollarSign,
  },
  {
    id: 6,
    name: 'Creative Fatigue Detection',
    description: 'Pause creatives when CTR drops 30% from initial performance',
    trigger: 'CTR decline > 30%',
    action: 'Pause creative',
    status: 'active',
    platform: 'Meta Ads',
    lastTriggered: '3 days ago',
    timesTriggered: 6,
    savings: 890,
    icon: Target,
  },
];

// Rule templates
const ruleTemplates = [
  {
    name: 'Budget Guardian',
    description: 'Prevent overspending by pausing when daily budget is exceeded',
    category: 'Budget',
  },
  {
    name: 'Performance Scaler',
    description: 'Automatically scale budget for high-performing campaigns',
    category: 'Optimization',
  },
  {
    name: 'Anomaly Detector',
    description: 'Alert on unusual changes in key metrics',
    category: 'Monitoring',
  },
  {
    name: 'Competitor Response',
    description: 'Adjust bids when competitor activity changes',
    category: 'Competition',
  },
];

export default function Automation() {
  const [rules, setRules] = useState(automationRules);

  const toggleRule = (id: number) => {
    setRules(
      rules.map((rule) =>
        rule.id === id
          ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
          : rule
      )
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const activeRules = rules.filter((r) => r.status === 'active').length;
  const totalSavings = rules.reduce((acc, r) => acc + (r.savings || 0), 0);
  const totalTriggers = rules.reduce((acc, r) => acc + r.timesTriggered, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation Rules</h1>
          <p className="text-muted-foreground">
            Set up intelligent rules to automatically optimize your campaigns.
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Power className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeRules}</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTriggers}</p>
                <p className="text-sm text-muted-foreground">Total Triggers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSavings)}</p>
                <p className="text-sm text-muted-foreground">Total Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800/50">
                <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">2h ago</p>
                <p className="text-sm text-muted-foreground">Last Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Your Automation Rules</CardTitle>
          <CardDescription>
            Rules are evaluated continuously and execute automatically when conditions are met
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={cn(
                'flex flex-col gap-4 rounded-lg border p-4 transition-all lg:flex-row lg:items-center lg:justify-between',
                rule.status === 'paused' && 'bg-muted/50 opacity-70'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'rounded-lg p-2',
                    rule.status === 'active'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <rule.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                        rule.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      )}
                    >
                      {rule.status === 'active' ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Pause className="h-3 w-3" />
                      )}
                      {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Trigger: </span>
                      <span className="font-medium">{rule.trigger}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action: </span>
                      <span className="font-medium">{rule.action}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform: </span>
                      <span className="font-medium">{rule.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground">Last Triggered</p>
                    <p className="font-medium">{rule.lastTriggered}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Times Run</p>
                    <p className="font-medium">{rule.timesTriggered}</p>
                  </div>
                  {rule.savings > 0 && (
                    <div>
                      <p className="text-muted-foreground">Savings</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(rule.savings)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRule(rule.id)}
                    title={rule.status === 'active' ? 'Pause rule' : 'Activate rule'}
                  >
                    {rule.status === 'active' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" title="Edit rule">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Delete rule">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rule Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Rule Templates</CardTitle>
          <CardDescription>
            Start with pre-built templates and customize to your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ruleTemplates.map((template) => (
              <div
                key={template.name}
                className="group cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {template.category}
                </div>
                <h4 className="font-semibold group-hover:text-primary">
                  {template.name}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <Button variant="ghost" size="sm" className="mt-3 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest automation executions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                rule: 'Pause Low ROAS Ad Sets',
                action: 'Paused "Brand Awareness - Desktop" ad set',
                time: '2 hours ago',
                status: 'success',
              },
              {
                rule: 'CPA Alert',
                action: 'Sent alert: CPA exceeded target for "Competitor Conquest"',
                time: '5 hours ago',
                status: 'alert',
              },
              {
                rule: 'Dayparting Bid Adjustments',
                action: 'Applied +15% bid modifier for peak hours',
                time: 'Yesterday, 7:00 PM',
                status: 'success',
              },
              {
                rule: 'Increase Budget for Winners',
                action: 'Increased "Summer Sale" budget from $5,000 to $6,000',
                time: '1 day ago',
                status: 'success',
              },
            ].map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      log.status === 'success' && 'bg-green-500',
                      log.status === 'alert' && 'bg-amber-500'
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      Rule: {log.rule}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
