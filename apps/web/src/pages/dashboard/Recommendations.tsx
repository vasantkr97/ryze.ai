import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  Zap,
  Check,
  X,
  Clock,
  Filter,
  RefreshCw,
  Lightbulb,
  BarChart3,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock recommendations data
const recommendationsData = [
  {
    id: 1,
    type: 'optimization',
    priority: 'critical',
    title: 'Increase budget for "Summer Sale" campaign',
    description:
      'This campaign is performing 45% above average ROAS and has exhausted 95% of its budget. Increasing budget by 20% could yield an additional $2,400 in revenue.',
    campaign: 'Summer Sale 2024',
    platform: 'Google Ads',
    impact: '+$2,400 projected revenue',
    impactType: 'revenue',
    effort: 'low',
    createdAt: '2 hours ago',
    metrics: {
      currentRoas: 4.2,
      avgRoas: 2.9,
      budgetUsed: 95,
    },
  },
  {
    id: 2,
    type: 'warning',
    priority: 'high',
    title: 'Pause underperforming ad sets in "Brand Awareness"',
    description:
      '3 ad sets have CPA 2x above target with declining CTR over the past week. Pausing these would save approximately $340/day without significantly impacting reach.',
    campaign: 'Brand Awareness Q1',
    platform: 'Meta Ads',
    impact: 'Save $340/day',
    impactType: 'savings',
    effort: 'low',
    createdAt: '4 hours ago',
    metrics: {
      currentCpa: 58.5,
      targetCpa: 29.0,
      affectedAdSets: 3,
    },
  },
  {
    id: 3,
    type: 'insight',
    priority: 'medium',
    title: 'New high-value audience segment identified',
    description:
      'Users aged 25-34 on mobile devices show 28% higher conversion rate. Consider creating dedicated ad sets targeting this segment with mobile-optimized creatives.',
    campaign: 'All Campaigns',
    platform: 'Cross-platform',
    impact: 'Potential +15% conversions',
    impactType: 'growth',
    effort: 'medium',
    createdAt: '6 hours ago',
    metrics: {
      segmentCvr: 4.2,
      overallCvr: 3.3,
      segmentSize: '45K users',
    },
  },
  {
    id: 4,
    type: 'optimization',
    priority: 'high',
    title: 'Reallocate budget from LinkedIn to Google Ads',
    description:
      'LinkedIn B2B Lead Gen campaign has lower ROAS (2.1x) compared to Google counterpart (4.8x). Shifting 30% of LinkedIn budget to Google could improve overall returns.',
    campaign: 'B2B Lead Gen',
    platform: 'LinkedIn Ads',
    impact: '+18% overall ROAS',
    impactType: 'efficiency',
    effort: 'medium',
    createdAt: '8 hours ago',
    metrics: {
      linkedinRoas: 2.1,
      googleRoas: 4.8,
      recommendedShift: '30%',
    },
  },
  {
    id: 5,
    type: 'automation',
    priority: 'medium',
    title: 'Enable bid adjustments for high-converting hours',
    description:
      'Analysis shows conversions peak between 7-9 PM with 35% higher CVR. Setting up dayparting rules could improve efficiency by automatically increasing bids during these hours.',
    campaign: 'Retargeting - Cart Abandoners',
    platform: 'Meta Ads',
    impact: 'Improve efficiency by 12%',
    impactType: 'efficiency',
    effort: 'low',
    createdAt: '12 hours ago',
    metrics: {
      peakHours: '7-9 PM',
      peakCvr: 5.2,
      offPeakCvr: 3.8,
    },
  },
  {
    id: 6,
    type: 'creative',
    priority: 'medium',
    title: 'Refresh creatives for "Product Launch" campaign',
    description:
      'Ad fatigue detected - CTR has declined 18% over the past 2 weeks. Consider refreshing creatives or testing new variations to maintain engagement.',
    campaign: 'Product Launch - Widget Pro',
    platform: 'Google Ads',
    impact: 'Recover CTR by ~15%',
    impactType: 'engagement',
    effort: 'high',
    createdAt: '1 day ago',
    metrics: {
      ctrDecline: '18%',
      frequency: 4.2,
      daysRunning: 21,
    },
  },
  {
    id: 7,
    type: 'insight',
    priority: 'low',
    title: 'Consider expanding to TikTok Ads',
    description:
      'Based on your target demographic (18-35) and product category, TikTok could be a valuable channel. Competitors in your space are seeing 3.2x ROAS on TikTok.',
    campaign: 'N/A',
    platform: 'TikTok Ads',
    impact: 'New growth channel',
    impactType: 'growth',
    effort: 'high',
    createdAt: '2 days ago',
    metrics: {
      competitorRoas: 3.2,
      audienceMatch: '78%',
      estimatedReach: '2.1M',
    },
  },
];

type PriorityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type TypeFilter = 'all' | 'optimization' | 'warning' | 'insight' | 'automation' | 'creative';

const priorityConfig = {
  critical: {
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    borderColor: 'border-l-red-500',
    icon: AlertTriangle,
  },
  high: {
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    borderColor: 'border-l-orange-500',
    icon: TrendingUp,
  },
  medium: {
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    borderColor: 'border-l-amber-500',
    icon: Target,
  },
  low: {
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    borderColor: 'border-l-blue-500',
    icon: Lightbulb,
  },
};

const typeConfig = {
  optimization: { icon: TrendingUp, label: 'Optimization' },
  warning: { icon: AlertTriangle, label: 'Warning' },
  insight: { icon: Lightbulb, label: 'Insight' },
  automation: { icon: Zap, label: 'Automation' },
  creative: { icon: Sparkles, label: 'Creative' },
};

export default function Recommendations() {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const handleApply = (id: number) => {
    setAppliedIds([...appliedIds, id]);
  };

  const handleDismiss = (id: number) => {
    setDismissedIds([...dismissedIds, id]);
  };

  const filteredRecommendations = recommendationsData.filter((rec) => {
    if (appliedIds.includes(rec.id) || dismissedIds.includes(rec.id)) return false;
    if (priorityFilter !== 'all' && rec.priority !== priorityFilter) return false;
    if (typeFilter !== 'all' && rec.type !== typeFilter) return false;
    return true;
  });

  const criticalCount = recommendationsData.filter(
    (r) => r.priority === 'critical' && !appliedIds.includes(r.id) && !dismissedIds.includes(r.id)
  ).length;
  const highCount = recommendationsData.filter(
    (r) => r.priority === 'high' && !appliedIds.includes(r.id) && !dismissedIds.includes(r.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
          <p className="text-muted-foreground">
            Personalized suggestions to optimize your campaigns.
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-sm text-muted-foreground">Critical Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{highCount}</p>
                <p className="text-sm text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">$3,580</p>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">+23%</p>
                <p className="text-sm text-muted-foreground">ROAS Opportunity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Priority:</span>
              <div className="flex gap-1">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map((priority) => (
                  <Button
                    key={priority}
                    variant={priorityFilter === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriorityFilter(priority)}
                    className="capitalize"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Type:</span>
              <div className="flex gap-1">
                {(['all', 'optimization', 'warning', 'insight', 'automation', 'creative'] as const).map(
                  (type) => (
                    <Button
                      key={type}
                      variant={typeFilter === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTypeFilter(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
              <p className="text-muted-foreground">
                No recommendations match your current filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecommendations.map((rec) => {
            const priorityStyle = priorityConfig[rec.priority as keyof typeof priorityConfig];
            const typeInfo = typeConfig[rec.type as keyof typeof typeConfig];
            const TypeIcon = typeInfo.icon;
            const PriorityIcon = priorityStyle.icon;

            return (
              <Card
                key={rec.id}
                className={cn('border-l-4 transition-all hover:shadow-md', priorityStyle.borderColor)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                            priorityStyle.color
                          )}
                        >
                          <PriorityIcon className="h-3 w-3" />
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          <TypeIcon className="h-3 w-3" />
                          {typeInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Clock className="mr-1 inline h-3 w-3" />
                          {rec.createdAt}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-lg font-semibold">{rec.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
                      </div>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Campaign: </span>
                          <span className="font-medium">{rec.campaign}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Platform: </span>
                          <span className="font-medium">{rec.platform}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Effort: </span>
                          <span
                            className={cn(
                              'font-medium',
                              rec.effort === 'low' && 'text-green-600',
                              rec.effort === 'medium' && 'text-amber-600',
                              rec.effort === 'high' && 'text-red-600'
                            )}
                          >
                            {rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Impact */}
                      <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{rec.impact}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row gap-2 lg:flex-col">
                      <Button onClick={() => handleApply(rec.id)} className="gap-2">
                        <Check className="h-4 w-4" />
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDismiss(rec.id)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Applied/Dismissed Summary */}
      {(appliedIds.length > 0 || dismissedIds.length > 0) && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                {appliedIds.length > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                    {appliedIds.length} applied
                  </span>
                )}
                {dismissedIds.length > 0 && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <X className="h-4 w-4" />
                    {dismissedIds.length} dismissed
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAppliedIds([]);
                  setDismissedIds([]);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
