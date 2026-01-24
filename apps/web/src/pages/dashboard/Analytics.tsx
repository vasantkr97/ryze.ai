import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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
import { cn } from '@/lib/utils';

// Mock data for performance over time
const performanceData = [
  { date: 'Jan 1', roas: 2.8, spend: 4200, revenue: 11760, conversions: 145, ctr: 3.2 },
  { date: 'Jan 8', roas: 3.1, spend: 4500, revenue: 13950, conversions: 162, ctr: 3.4 },
  { date: 'Jan 15', roas: 2.9, spend: 4100, revenue: 11890, conversions: 138, ctr: 3.1 },
  { date: 'Jan 22', roas: 3.4, spend: 4800, revenue: 16320, conversions: 189, ctr: 3.6 },
  { date: 'Jan 29', roas: 3.2, spend: 4600, revenue: 14720, conversions: 175, ctr: 3.3 },
  { date: 'Feb 5', roas: 3.6, spend: 5100, revenue: 18360, conversions: 210, ctr: 3.7 },
  { date: 'Feb 12', roas: 3.8, spend: 5400, revenue: 20520, conversions: 228, ctr: 3.9 },
  { date: 'Feb 19', roas: 3.5, spend: 5200, revenue: 18200, conversions: 195, ctr: 3.5 },
  { date: 'Feb 26', roas: 4.1, spend: 5800, revenue: 23780, conversions: 267, ctr: 4.1 },
  { date: 'Mar 5', roas: 4.3, spend: 6200, revenue: 26660, conversions: 298, ctr: 4.2 },
];

// Mock data for platform breakdown
const platformData = [
  { name: 'Google Ads', spend: 24500, revenue: 98000, roas: 4.0, color: 'hsl(var(--chart-4))' },
  { name: 'Meta Ads', spend: 18200, revenue: 63700, roas: 3.5, color: 'hsl(var(--chart-1))' },
  { name: 'LinkedIn', spend: 5500, revenue: 27500, roas: 5.0, color: 'hsl(var(--chart-2))' },
  { name: 'TikTok', spend: 3800, revenue: 11400, roas: 3.0, color: 'hsl(var(--chart-5))' },
];

// Mock data for campaign performance
const campaignPerformance = [
  { name: 'Summer Sale', conversions: 298, spend: 6200 },
  { name: 'Brand Awareness', conversions: 234, spend: 6890 },
  { name: 'B2B Lead Gen', conversions: 156, spend: 2100 },
  { name: 'Retargeting', conversions: 189, spend: 890 },
  { name: 'Product Launch', conversions: 112, spend: 4560 },
];

// Mock data for device breakdown
const deviceData = [
  { name: 'Mobile', value: 58, color: 'hsl(var(--chart-1))' },
  { name: 'Desktop', value: 32, color: 'hsl(var(--chart-2))' },
  { name: 'Tablet', value: 10, color: 'hsl(var(--chart-3))' },
];

// Metrics summary
const metricsSummary = [
  { label: 'Total Spend', value: '$48,250', change: 15.7, trend: 'up', color: 'from-amber-500/20 to-amber-500/5', iconColor: 'text-amber-500' },
  { label: 'Total Revenue', value: '$195,160', change: 22.3, trend: 'up', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-500' },
  { label: 'ROAS', value: '4.05x', change: 12.1, trend: 'up', color: 'from-blue-500/20 to-blue-500/5', iconColor: 'text-blue-500' },
  { label: 'Conversions', value: '1,847', change: 18.9, trend: 'up', color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-500' },
  { label: 'CTR', value: '3.8%', change: 5.2, trend: 'up', color: 'from-pink-500/20 to-pink-500/5', iconColor: 'text-pink-500' },
  { label: 'CPA', value: '$26.12', change: -8.3, trend: 'down', color: 'from-cyan-500/20 to-cyan-500/5', iconColor: 'text-cyan-500' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-xl">
        <p className="text-sm font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {entry.name.includes('Revenue') || entry.name.includes('Spend')
                ? `$${entry.value.toLocaleString()}`
                : entry.name.includes('ROAS')
                ? `${entry.value}x`
                : entry.name.includes('CTR')
                ? `${entry.value}%`
                : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive performance insights across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 border-border/50 bg-card/50">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-border/50 bg-card/50">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-border/50 bg-card/50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metricsSummary.map((metric) => (
          <Card key={metric.label} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              metric.color
            )} />
            <CardContent className="relative p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold mt-1">{metric.value}</p>
              <p
                className={cn(
                  'flex items-center text-xs mt-1',
                  (metric.trend === 'up' && metric.label !== 'CPA') ||
                  (metric.trend === 'down' && metric.label === 'CPA')
                    ? 'text-emerald-500'
                    : 'text-red-500'
                )}
              >
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {metric.change > 0 ? '+' : ''}
                {metric.change}% vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Performance Over Time
              </CardTitle>
              <CardDescription>Revenue and spend trends</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="Spend"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSpend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Platform Performance
            </CardTitle>
            <CardDescription>Spend and revenue by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                  <Bar dataKey="spend" name="Spend" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-violet-500" />
              Device Distribution
            </CardTitle>
            <CardDescription>Conversions by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-500" />
            Top Campaigns by Conversions
          </CardTitle>
          <CardDescription>Performance comparison across campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                />
                <Bar
                  dataKey="conversions"
                  name="Conversions"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Detail */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              ROAS Trend
            </CardTitle>
            <CardDescription>Return on ad spend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}x`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="roas"
                    name="ROAS"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-emerald-500" />
              CTR Trend
            </CardTitle>
            <CardDescription>Click-through rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="ctr"
                    name="CTR"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
