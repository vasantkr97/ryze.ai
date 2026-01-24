import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
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
  { name: 'Google Ads', spend: 24500, revenue: 98000, roas: 4.0, color: '#4285F4' },
  { name: 'Meta Ads', spend: 18200, revenue: 63700, roas: 3.5, color: '#1877F2' },
  { name: 'LinkedIn', spend: 5500, revenue: 27500, roas: 5.0, color: '#0A66C2' },
  { name: 'TikTok', spend: 3800, revenue: 11400, roas: 3.0, color: '#000000' },
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
  { name: 'Mobile', value: 58, color: '#8884d8' },
  { name: 'Desktop', value: 32, color: '#82ca9d' },
  { name: 'Tablet', value: 10, color: '#ffc658' },
];

// Metrics summary
const metricsSummary = [
  { label: 'Total Spend', value: '$48,250', change: 15.7, trend: 'up' },
  { label: 'Total Revenue', value: '$195,160', change: 22.3, trend: 'up' },
  { label: 'ROAS', value: '4.05x', change: 12.1, trend: 'up' },
  { label: 'Conversions', value: '1,847', change: 18.9, trend: 'up' },
  { label: 'CTR', value: '3.8%', change: 5.2, trend: 'up' },
  { label: 'CPA', value: '$26.12', change: -8.3, trend: 'down' },
];

export default function Analytics() {
  const [_dateRange, _setDateRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive performance insights across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metricsSummary.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xl font-bold">{metric.value}</p>
              <p
                className={cn(
                  'flex items-center text-xs',
                  (metric.trend === 'up' && metric.label !== 'CPA') ||
                  (metric.trend === 'down' && metric.label === 'CPA')
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
                {metric.change}% vs last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Revenue and spend trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
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
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    name="Spend"
                    stroke="#82ca9d"
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
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Spend and ROAS by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    type="number"
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`,
                      name === 'spend' ? 'Spend' : 'Revenue',
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="spend" name="Spend" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
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
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Share']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Campaigns by Conversions</CardTitle>
          <CardDescription>Performance comparison across campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" tickLine={false} axisLine={false} />
                <YAxis className="text-xs" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
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
        <Card>
          <CardHeader>
            <CardTitle>ROAS Trend</CardTitle>
            <CardDescription>Return on ad spend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
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
                    formatter={(value: number) => [`${value}x`, 'ROAS']}
                  />
                  <Line
                    type="monotone"
                    dataKey="roas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CTR Trend</CardTitle>
            <CardDescription>Click-through rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'CTR']}
                  />
                  <Line
                    type="monotone"
                    dataKey="ctr"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d' }}
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
