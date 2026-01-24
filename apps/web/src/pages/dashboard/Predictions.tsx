import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

// Mock prediction data
const roasPrediction = [
  { day: 'Today', actual: 4.2, predicted: 4.2 },
  { day: '+1', actual: null, predicted: 4.0 },
  { day: '+2', actual: null, predicted: 3.8 },
  { day: '+3', actual: null, predicted: 3.5 },
  { day: '+4', actual: null, predicted: 3.3 },
  { day: '+5', actual: null, predicted: 3.2 },
  { day: '+6', actual: null, predicted: 3.4 },
  { day: '+7', actual: null, predicted: 3.6 },
];

const spendPrediction = [
  { day: 'Today', actual: 6200, predicted: 6200 },
  { day: '+1', actual: null, predicted: 6400 },
  { day: '+2', actual: null, predicted: 6600 },
  { day: '+3', actual: null, predicted: 6800 },
  { day: '+4', actual: null, predicted: 7000 },
  { day: '+5', actual: null, predicted: 7200 },
  { day: '+6', actual: null, predicted: 7400 },
  { day: '+7', actual: null, predicted: 7600 },
];

// Active alerts
const activeAlerts = [
  {
    id: 1,
    type: 'warning',
    severity: 'high',
    title: 'ROAS Drop Predicted',
    description: 'Summer Sale campaign ROAS expected to drop 25% in the next 48 hours based on current trends.',
    campaign: 'Summer Sale 2024',
    predictedImpact: '-$1,200 revenue',
    timeframe: '48 hours',
    confidence: 87,
    recommendations: [
      'Refresh creatives to combat ad fatigue',
      'Adjust bidding strategy to target ROAS',
      'Expand audience to reduce frequency',
    ],
  },
  {
    id: 2,
    type: 'opportunity',
    severity: 'medium',
    title: 'Budget Ceiling Approaching',
    description: 'B2B Lead Gen campaign will exhaust budget by Thursday. High performance suggests budget increase.',
    campaign: 'B2B Lead Gen',
    predictedImpact: '+$800 potential revenue',
    timeframe: '3 days',
    confidence: 92,
    recommendations: [
      'Increase daily budget by 30%',
      'Enable automated budget optimization',
    ],
  },
  {
    id: 3,
    type: 'warning',
    severity: 'medium',
    title: 'CPA Trending Up',
    description: 'Retargeting campaign CPA has increased 15% this week and is projected to exceed target.',
    campaign: 'Retargeting - Cart Abandoners',
    predictedImpact: '+$12 CPA increase',
    timeframe: '5 days',
    confidence: 78,
    recommendations: [
      'Review and refine audience segments',
      'Test new creative variations',
      'Implement frequency capping',
    ],
  },
  {
    id: 4,
    type: 'info',
    severity: 'low',
    title: 'Seasonal Trend Detected',
    description: 'Historical data indicates 20% traffic increase expected next week due to seasonal patterns.',
    campaign: 'All Campaigns',
    predictedImpact: '+20% traffic',
    timeframe: '1 week',
    confidence: 94,
    recommendations: [
      'Prepare additional budget allocation',
      'Ensure ad inventory is sufficient',
      'Review landing page capacity',
    ],
  },
];

// Forecast summary
const forecastSummary = [
  {
    metric: 'Projected ROAS',
    current: '4.2x',
    predicted: '3.6x',
    change: -14.3,
    trend: 'down',
  },
  {
    metric: 'Projected Spend',
    current: '$43,400',
    predicted: '$49,200',
    change: 13.4,
    trend: 'up',
  },
  {
    metric: 'Projected Conversions',
    current: '1,847',
    predicted: '2,120',
    change: 14.8,
    trend: 'up',
  },
  {
    metric: 'Projected Revenue',
    current: '$195,160',
    predicted: '$177,120',
    change: -9.2,
    trend: 'down',
  },
];

export default function Predictions() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictions & Alerts</h1>
          <p className="text-muted-foreground">
            AI-powered forecasts and early warning system for your campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Alert Settings
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            7-Day Forecast
          </Button>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {forecastSummary.map((item) => (
          <Card key={item.metric}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.metric}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{item.predicted}</p>
                <p
                  className={cn(
                    'flex items-center text-sm',
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {item.change > 0 ? '+' : ''}
                  {item.change}%
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Current: {item.current}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prediction Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ROAS Forecast</CardTitle>
            <CardDescription>7-day ROAS prediction with confidence interval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roasPrediction}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}x`}
                    domain={[2, 5]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine y={3.0} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label="Target" />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 bg-primary" />
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-4 border-t-2 border-dashed border-primary" />
                <span className="text-muted-foreground">Predicted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spend Forecast</CardTitle>
            <CardDescription>Projected daily spend for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendPrediction}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#82ca9d' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                AI-detected issues and opportunities requiring attention
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="h-3 w-3" />
                {activeAlerts.filter((a) => a.severity === 'high').length} High Priority
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'rounded-lg border p-4',
                alert.severity === 'high' && 'border-l-4 border-l-red-500',
                alert.severity === 'medium' && 'border-l-4 border-l-amber-500',
                alert.severity === 'low' && 'border-l-4 border-l-blue-500'
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                        alert.type === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        alert.type === 'opportunity' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        alert.type === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      )}
                    >
                      {alert.type === 'warning' && <AlertTriangle className="h-3 w-3" />}
                      {alert.type === 'opportunity' && <TrendingUp className="h-3 w-3" />}
                      {alert.type === 'info' && <Eye className="h-3 w-3" />}
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      {alert.timeframe}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <Sparkles className="h-3 w-3" />
                      {alert.confidence}% confidence
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{alert.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Campaign: </span>
                      <span className="font-medium">{alert.campaign}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Impact: </span>
                      <span
                        className={cn(
                          'font-medium',
                          alert.predictedImpact.startsWith('+')
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {alert.predictedImpact}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {alert.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-row gap-2 lg:flex-col">
                  <Button size="sm">
                    Take Action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/90 p-3">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">AI Prediction Summary</h3>
              <p className="mt-1 text-muted-foreground">
                Based on current trends and historical patterns, your overall portfolio is projected to see a
                <span className="mx-1 font-medium text-amber-600">14% ROAS decline</span>
                over the next 7 days if no action is taken. The primary driver is creative fatigue in your
                top-performing campaigns. I recommend refreshing creatives for "Summer Sale" and "Brand Awareness"
                campaigns immediately to mitigate this projected decline.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate New Creatives
                </Button>
                <Button variant="outline" size="sm">
                  View Full Analysis
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
