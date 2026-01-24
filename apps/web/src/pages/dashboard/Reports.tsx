import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Plus,
  Eye,
  Trash2,
  Mail,
  MoreVertical,
  Search,
  CheckCircle2,
  RefreshCw,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
} from 'lucide-react';
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

// Report templates
const reportTemplates = [
  {
    id: 'performance',
    name: 'Performance Overview',
    description: 'Complete overview of all campaigns, spend, and ROI',
    icon: BarChart3,
    metrics: ['ROAS', 'Spend', 'Revenue', 'Conversions'],
  },
  {
    id: 'campaign',
    name: 'Campaign Analysis',
    description: 'Deep dive into specific campaign performance',
    icon: TrendingUp,
    metrics: ['CTR', 'CPC', 'Impressions', 'Conversions'],
  },
  {
    id: 'budget',
    name: 'Budget Report',
    description: 'Budget utilization and allocation analysis',
    icon: DollarSign,
    metrics: ['Budget Used', 'Remaining', 'Pacing', 'Forecast'],
  },
  {
    id: 'audience',
    name: 'Audience Insights',
    description: 'Demographics, segments, and targeting performance',
    icon: Users,
    metrics: ['Reach', 'Engagement', 'Demographics', 'Segments'],
  },
];

// Recent reports
const recentReports = [
  {
    id: 1,
    name: 'Weekly Performance Report',
    type: 'performance',
    dateRange: 'Jan 15 - Jan 21, 2024',
    status: 'completed',
    generatedAt: '2 hours ago',
    size: '2.4 MB',
    format: 'PDF',
    scheduled: true,
    frequency: 'Weekly',
  },
  {
    id: 2,
    name: 'Q4 2023 Campaign Analysis',
    type: 'campaign',
    dateRange: 'Oct 1 - Dec 31, 2023',
    status: 'completed',
    generatedAt: '1 day ago',
    size: '5.8 MB',
    format: 'PDF',
    scheduled: false,
    frequency: null,
  },
  {
    id: 3,
    name: 'Monthly Budget Review',
    type: 'budget',
    dateRange: 'Jan 1 - Jan 31, 2024',
    status: 'generating',
    generatedAt: null,
    size: null,
    format: 'Excel',
    scheduled: true,
    frequency: 'Monthly',
  },
  {
    id: 4,
    name: 'Summer Sale Campaign Report',
    type: 'campaign',
    dateRange: 'Jul 1 - Aug 31, 2023',
    status: 'completed',
    generatedAt: '3 days ago',
    size: '3.1 MB',
    format: 'PDF',
    scheduled: false,
    frequency: null,
  },
  {
    id: 5,
    name: 'Audience Demographics Analysis',
    type: 'audience',
    dateRange: 'Jan 1 - Jan 21, 2024',
    status: 'completed',
    generatedAt: '5 days ago',
    size: '1.8 MB',
    format: 'PDF',
    scheduled: false,
    frequency: null,
  },
];

// Scheduled reports
const scheduledReports = [
  {
    id: 1,
    name: 'Weekly Performance Report',
    frequency: 'Every Monday at 9:00 AM',
    recipients: ['team@company.com', 'cmo@company.com'],
    nextRun: 'Monday, Jan 29',
    status: 'active',
  },
  {
    id: 2,
    name: 'Monthly Budget Review',
    frequency: '1st of every month',
    recipients: ['finance@company.com'],
    nextRun: 'Feb 1',
    status: 'active',
  },
  {
    id: 3,
    name: 'Executive Dashboard',
    frequency: 'Every Friday at 5:00 PM',
    recipients: ['ceo@company.com', 'cmo@company.com'],
    nextRun: 'Friday, Jan 26',
    status: 'paused',
  },
];

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredReports = recentReports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and download campaign reports.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Choose a template to generate a new report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={cn(
                  'flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-all hover:border-primary hover:shadow-md',
                  selectedTemplate === template.id && 'border-primary bg-primary/5'
                )}
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <template.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.metrics.slice(0, 3).map((metric) => (
                    <span
                      key={metric}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
          {selectedTemplate && (
            <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {reportTemplates.find((t) => t.id === selectedTemplate)?.name} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Select Date Range
                </Button>
                <Button size="sm">Generate Report</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your generated and scheduled reports</CardDescription>
            </div>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{report.name}</h4>
                      {report.scheduled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <Clock className="h-3 w-3" />
                          {report.frequency}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {report.dateRange}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {report.generatedAt && (
                        <span>Generated {report.generatedAt}</span>
                      )}
                      {report.size && <span>{report.size}</span>}
                      <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                        {report.format}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'generating' ? (
                    <Button variant="outline" size="sm" disabled>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated reports delivered to your inbox</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledReports.map((report) => (
              <div
                key={report.id}
                className={cn(
                  'flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
                  report.status === 'paused' && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{report.name}</h4>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          report.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        )}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.frequency}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {report.recipients.length} recipient{report.recipients.length > 1 ? 's' : ''}
                      </span>
                      <span>Next: {report.nextRun}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">Quick Export</h3>
              <p className="text-sm text-muted-foreground">
                Export all your campaign data for the selected period
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
