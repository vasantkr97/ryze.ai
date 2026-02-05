import {
  Users,
  Eye,
  MousePointer,
  ShoppingCart,
  CreditCard,
  Heart,
  ArrowRight,
  Clock,
  Target,
  Filter,
  Download,
  Sparkles,
} from 'lucide-react';
import {
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  LabelList,
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

// Journey stages with metrics
const journeyStages = [
  {
    name: 'Awareness',
    icon: Eye,
    users: 125000,
    value: 125000,
    fill: '#6b7280',
    conversionRate: null,
    avgTimeInStage: '0 days',
    topChannels: ['Meta Ads', 'Google Display', 'TikTok'],
    description: 'First touchpoint with your brand',
  },
  {
    name: 'Interest',
    icon: MousePointer,
    users: 45000,
    value: 45000,
    fill: '#71717a',
    conversionRate: 36,
    avgTimeInStage: '2.3 days',
    topChannels: ['Google Search', 'Retargeting', 'Email'],
    description: 'Engaged with content or ads',
  },
  {
    name: 'Consideration',
    icon: ShoppingCart,
    users: 12500,
    value: 12500,
    fill: '#78716c',
    conversionRate: 27.8,
    avgTimeInStage: '5.1 days',
    topChannels: ['Google Search', 'Direct', 'Referral'],
    description: 'Viewing products, comparing options',
  },
  {
    name: 'Purchase',
    icon: CreditCard,
    users: 3750,
    value: 3750,
    fill: '#737373',
    conversionRate: 30,
    avgTimeInStage: '1.8 days',
    topChannels: ['Direct', 'Email', 'Retargeting'],
    description: 'Completed a purchase',
  },
  {
    name: 'Advocacy',
    icon: Heart,
    users: 890,
    value: 890,
    fill: '#6b7280',
    conversionRate: 23.7,
    avgTimeInStage: '14 days',
    topChannels: ['Email', 'Organic Social', 'Referral'],
    description: 'Repeat buyers & brand advocates',
  },
];

// Journey insights
const journeyInsights = [
  {
    title: 'Drop-off at Consideration Stage',
    description: '72% of users drop off between Interest and Consideration. Cart abandonment retargeting could recover an estimated 15% of these users.',
    impact: 'high',
    metric: '72% drop-off',
    suggestion: 'Implement abandoned cart email sequence',
  },
  {
    title: 'Mobile Users Convert Faster',
    description: 'Mobile users complete the journey 2.3 days faster than desktop users on average.',
    impact: 'insight',
    metric: '2.3 days faster',
    suggestion: 'Optimize mobile checkout experience',
  },
  {
    title: 'Email Most Effective for Purchase Stage',
    description: 'Email campaigns drive 42% of Purchase stage conversions, outperforming all paid channels.',
    impact: 'opportunity',
    metric: '42% of purchases',
    suggestion: 'Increase email marketing investment',
  },
  {
    title: 'Low Advocacy Rate',
    description: 'Only 23.7% of customers become advocates. Industry average is 35%.',
    impact: 'medium',
    metric: '23.7% vs 35%',
    suggestion: 'Launch referral program',
  },
];

// Attribution data
const attributionData = [
  { channel: 'Google Ads', firstTouch: 32, lastTouch: 28, linear: 30, contribution: 156000 },
  { channel: 'Meta Ads', firstTouch: 28, lastTouch: 22, linear: 25, contribution: 125000 },
  { channel: 'Email', firstTouch: 5, lastTouch: 25, linear: 15, contribution: 75000 },
  { channel: 'Direct', firstTouch: 8, lastTouch: 15, linear: 12, contribution: 60000 },
  { channel: 'Organic Search', firstTouch: 15, lastTouch: 6, linear: 10, contribution: 50000 },
  { channel: 'Referral', firstTouch: 12, lastTouch: 4, linear: 8, contribution: 40000 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: data.fill }}
          />
          <p className="font-semibold text-foreground text-sm">{data.name}</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight">
            {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(data.value)}
            <span className="text-xs font-normal text-muted-foreground ml-1">users</span>
          </p>
          {data.conversionRate && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-green-500 font-medium">{data.conversionRate}%</span> conversion rate
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
            {data.description}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function Journeys() {
  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const overallConversionRate = ((journeyStages[3].users / journeyStages[0].users) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audience Journeys</h1>
          <p className="text-muted-foreground">
            Visualize and optimize the complete customer journey from awareness to advocacy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(journeyStages[0].users)}</p>
                <p className="text-sm text-muted-foreground">Total Reach</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{overallConversionRate}%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(journeyStages[3].users)}</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">9.2 days</p>
                <p className="text-sm text-muted-foreground">Avg. Journey Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User progression through each stage of the journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  content={<CustomTooltip />} 
                  wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                  position={{ x: 0, y: 0 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Funnel
                  dataKey="value"
                  data={journeyStages}
                  isAnimationActive
                >
                  {journeyStages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    position="center"
                    content={({ x, y, width, height, value, name }: any) => {
                      return (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm font-medium"
                        >
                          {name}: {formatNumber(value as number)}
                        </text>
                      );
                    }}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Stage Breakdown</CardTitle>
          <CardDescription>Detailed metrics for each journey stage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeyStages.map((stage, index) => (
              <div
                key={stage.name}
                className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-default bg-card/50 hover:bg-card"
              >
                <div className="flex items-center gap-4 lg:w-1/4">
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: `${stage.fill}20` }}
                  >
                    <stage.icon className="h-6 w-6" style={{ color: stage.fill }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="text-xl font-bold">{formatNumber(stage.users)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-xl font-bold">
                      {stage.conversionRate ? `${stage.conversionRate}%` : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Time</p>
                    <p className="text-xl font-bold">{stage.avgTimeInStage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Top Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {stage.topChannels.slice(0, 2).map((channel) => (
                        <span
                          key={channel}
                          className="rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {index < journeyStages.length - 1 && (
                  <div className="hidden lg:flex lg:w-16 lg:justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Journey Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Journey Insights</CardTitle>
          </div>
          <CardDescription>Key opportunities to optimize your conversion funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {journeyInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default',
                  insight.impact === 'high' && 'border-l-4 border-l-red-500 hover:bg-red-500/5',
                  insight.impact === 'medium' && 'border-l-4 border-l-amber-500 hover:bg-amber-500/5',
                  insight.impact === 'opportunity' && 'border-l-4 border-l-green-500 hover:bg-green-500/5',
                  insight.impact === 'insight' && 'border-l-4 border-l-blue-500 hover:bg-blue-500/5'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{insight.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                        {insight.metric}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {insight.suggestion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attribution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Touch Attribution</CardTitle>
          <CardDescription>Channel contribution across different attribution models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Channel</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">First Touch %</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Last Touch %</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Linear %</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Revenue Contribution</th>
                </tr>
              </thead>
              <tbody>
                {attributionData.map((row) => (
                  <tr key={row.channel} className="border-b">
                    <td className="px-4 py-3 font-medium">{row.channel}</td>
                    <td className="px-4 py-3 text-right">{row.firstTouch}%</td>
                    <td className="px-4 py-3 text-right">{row.lastTouch}%</td>
                    <td className="px-4 py-3 text-right">{row.linear}%</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(row.contribution)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
