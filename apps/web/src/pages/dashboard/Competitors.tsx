import { useState } from 'react';
import {
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  Search,
  ExternalLink,
  MoreVertical,
  Globe,
  DollarSign,
  Megaphone,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock competitors data
const competitors = [
  {
    id: 1,
    name: 'TechCorp Pro',
    domain: 'techcorppro.com',
    category: 'Direct Competitor',
    status: 'active',
    estimatedSpend: 85000,
    adCount: 45,
    platforms: ['Google Ads', 'Meta Ads', 'LinkedIn'],
    topKeywords: ['enterprise software', 'business automation', 'productivity tools'],
    recentActivity: 'Launched new video campaign',
    change: 15,
    trend: 'up',
  },
  {
    id: 2,
    name: 'SaaS Solutions Inc',
    domain: 'saassolutions.io',
    category: 'Direct Competitor',
    status: 'active',
    estimatedSpend: 62000,
    adCount: 32,
    platforms: ['Google Ads', 'Meta Ads'],
    topKeywords: ['saas platform', 'cloud software', 'team collaboration'],
    recentActivity: 'Increased Google Ads budget',
    change: 8,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Digital First Co',
    domain: 'digitalfirst.co',
    category: 'Indirect Competitor',
    status: 'active',
    estimatedSpend: 45000,
    adCount: 28,
    platforms: ['Meta Ads', 'TikTok'],
    topKeywords: ['digital transformation', 'marketing automation', 'growth tools'],
    recentActivity: 'New TikTok presence detected',
    change: -5,
    trend: 'down',
  },
  {
    id: 4,
    name: 'Enterprise Hub',
    domain: 'enterprisehub.com',
    category: 'Direct Competitor',
    status: 'active',
    estimatedSpend: 120000,
    adCount: 67,
    platforms: ['Google Ads', 'LinkedIn', 'Meta Ads'],
    topKeywords: ['enterprise solution', 'b2b platform', 'business software'],
    recentActivity: 'Aggressive LinkedIn targeting',
    change: 22,
    trend: 'up',
  },
];

// Competitor ad spend comparison
const spendComparison = [
  { month: 'Sep', you: 38000, competitor1: 72000, competitor2: 55000, competitor3: 42000 },
  { month: 'Oct', you: 42000, competitor1: 78000, competitor2: 58000, competitor3: 45000 },
  { month: 'Nov', you: 45000, competitor1: 82000, competitor2: 60000, competitor3: 48000 },
  { month: 'Dec', you: 48000, competitor1: 85000, competitor2: 62000, competitor3: 45000 },
];

// Competitive insights
const competitiveInsights = [
  {
    title: 'TechCorp Pro launching aggressive LinkedIn campaign',
    description: 'Detected 40% increase in LinkedIn ad spend targeting B2B decision makers in your key demographics.',
    impact: 'high',
    action: 'Consider increasing LinkedIn presence',
  },
  {
    title: 'Gap identified in TikTok advertising',
    description: 'None of your direct competitors have significant TikTok presence. Potential first-mover advantage.',
    impact: 'opportunity',
    action: 'Explore TikTok ad pilot',
  },
  {
    title: 'Competitor bidding on your brand keywords',
    description: 'Enterprise Hub is now bidding on your brand name keywords on Google Ads.',
    impact: 'medium',
    action: 'Increase brand keyword bids',
  },
  {
    title: 'New entrant detected',
    description: 'CloudWave Solutions has started advertising in your category with $15K estimated monthly spend.',
    impact: 'low',
    action: 'Monitor activity',
  },
];

export default function Competitors() {
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredCompetitors = competitors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCompetitorSpend = competitors.reduce((acc, c) => acc + c.estimatedSpend, 0);
  const avgAdCount = Math.round(competitors.reduce((acc, c) => acc + c.adCount, 0) / competitors.length);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Intelligence</h1>
          <p className="text-muted-foreground">
            Track competitor advertising strategies and market positioning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            Track Competitor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{competitors.length}</p>
                <p className="text-sm text-muted-foreground">Tracked Competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalCompetitorSpend)}</p>
                <p className="text-sm text-muted-foreground">Est. Monthly Spend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Megaphone className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgAdCount}</p>
                <p className="text-sm text-muted-foreground">Avg. Active Ads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{competitiveInsights.filter(i => i.impact === 'high').length}</p>
                <p className="text-sm text-muted-foreground">High-Priority Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Competitive Insights</CardTitle>
          </div>
          <CardDescription>Key developments in your competitive landscape</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {competitiveInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-4',
                  insight.impact === 'high' && 'border-l-4 border-l-red-500',
                  insight.impact === 'medium' && 'border-l-4 border-l-amber-500',
                  insight.impact === 'opportunity' && 'border-l-4 border-l-green-500',
                  insight.impact === 'low' && 'border-l-4 border-l-blue-500'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Suggested: {insight.action}
                    </div>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      insight.impact === 'high' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                      insight.impact === 'medium' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                      insight.impact === 'opportunity' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                      insight.impact === 'low' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    )}
                  >
                    {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spend Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Spend Comparison</CardTitle>
          <CardDescription>Monthly estimated ad spend vs. top competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis
                  className="text-xs"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                <Bar dataKey="you" name="You" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="competitor1" name="TechCorp Pro" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="competitor2" name="SaaS Solutions" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="competitor3" name="Digital First" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Competitors List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Tracked Competitors</CardTitle>
              <CardDescription>Monitor competitor advertising activity</CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search competitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCompetitors.map((competitor) => (
              <div
                key={competitor.id}
                className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted font-bold">
                    {competitor.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{competitor.name}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {competitor.category}
                      </span>
                    </div>
                    <a
                      href={`https://${competitor.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Globe className="h-3 w-3" />
                      {competitor.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {competitor.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Est. Spend</p>
                      <p className="font-semibold">{formatCurrency(competitor.estimatedSpend)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Ads</p>
                      <p className="font-semibold">{competitor.adCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trend</p>
                      <p
                        className={cn(
                          'flex items-center font-semibold',
                          competitor.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {competitor.trend === 'up' ? (
                          <TrendingUp className="mr-1 h-4 w-4" />
                        ) : (
                          <TrendingDown className="mr-1 h-4 w-4" />
                        )}
                        {competitor.change > 0 ? '+' : ''}
                        {competitor.change}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Ads
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
