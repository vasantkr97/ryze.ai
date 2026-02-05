import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Mock campaigns data
const campaignsData = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    platform: 'google-ads',
    platformName: 'Google Ads',
    status: 'active',
    budget: 5000,
    spend: 3245,
    impressions: 125400,
    clicks: 4762,
    conversions: 189,
    roas: 4.2,
    ctr: 3.8,
    cpa: 17.17,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Brand Awareness Q1',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'active',
    budget: 8000,
    spend: 6890,
    impressions: 345000,
    clicks: 12450,
    conversions: 234,
    roas: 3.1,
    ctr: 3.6,
    cpa: 29.44,
    trend: 'down',
  },
  {
    id: 3,
    name: 'B2B Lead Gen',
    platform: 'linkedin',
    platformName: 'LinkedIn Ads',
    status: 'active',
    budget: 3000,
    spend: 2100,
    impressions: 45000,
    clicks: 890,
    conversions: 45,
    roas: 5.8,
    ctr: 1.98,
    cpa: 46.67,
    trend: 'up',
  },
  {
    id: 4,
    name: 'Retargeting - Cart Abandoners',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'paused',
    budget: 2000,
    spend: 890,
    impressions: 67000,
    clicks: 2340,
    conversions: 67,
    roas: 6.2,
    ctr: 3.49,
    cpa: 13.28,
    trend: 'up',
  },
  {
    id: 5,
    name: 'Product Launch - Widget Pro',
    platform: 'google-ads',
    platformName: 'Google Ads',
    status: 'active',
    budget: 10000,
    spend: 4560,
    impressions: 89000,
    clicks: 3200,
    conversions: 112,
    roas: 3.8,
    ctr: 3.6,
    cpa: 40.71,
    trend: 'up',
  },
  {
    id: 6,
    name: 'Holiday Promo',
    platform: 'tiktok',
    platformName: 'TikTok Ads',
    status: 'draft',
    budget: 5000,
    spend: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    roas: 0,
    ctr: 0,
    cpa: 0,
    trend: 'neutral',
  },
  {
    id: 7,
    name: 'Competitor Conquest',
    platform: 'google-ads',
    platformName: 'Google Ads',
    status: 'active',
    budget: 4500,
    spend: 3890,
    impressions: 78000,
    clicks: 2890,
    conversions: 98,
    roas: 2.9,
    ctr: 3.71,
    cpa: 39.69,
    trend: 'down',
  },
  {
    id: 8,
    name: 'Video Ads - Testimonials',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'active',
    budget: 3500,
    spend: 2780,
    impressions: 234000,
    clicks: 8900,
    conversions: 156,
    roas: 4.5,
    ctr: 3.8,
    cpa: 17.82,
    trend: 'up',
  },
];

type SortField = 'name' | 'spend' | 'roas' | 'conversions';
type SortDirection = 'asc' | 'desc';

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'active' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        status === 'paused' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        status === 'draft' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      )}
    >
      {status === 'active' && <Play className="h-3 w-3" />}
      {status === 'paused' && <Pause className="h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    'google-ads': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'meta': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'linkedin': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    'tiktok': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };

  const names: Record<string, string> = {
    'google-ads': 'Google',
    'meta': 'Meta',
    'linkedin': 'LinkedIn',
    'tiktok': 'TikTok',
  };

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', colors[platform])}>
      {names[platform] || platform}
    </span>
  );
}

export default function Campaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('spend');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredCampaigns = campaignsData
    .filter((campaign) => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return modifier * a.name.localeCompare(b.name);
      }
      return modifier * (a[sortField] - b[sortField]);
    });

  // Summary stats
  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalBudget = filteredCampaigns.reduce((acc, c) => acc + c.budget, 0);
  const totalConversions = filteredCampaigns.reduce((acc, c) => acc + c.conversions, 0);
  const avgRoas = filteredCampaigns.filter(c => c.roas > 0).reduce((acc, c) => acc + c.roas, 0) /
    filteredCampaigns.filter(c => c.roas > 0).length || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your advertising campaigns.
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Spend</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSpend)}</p>
            <p className="text-xs text-muted-foreground">of {formatCurrency(totalBudget)} budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Conversions</p>
            <p className="text-2xl font-bold">{formatNumber(totalConversions)}</p>
            <p className="text-xs text-muted-foreground">across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Average ROAS</p>
            <p className="text-2xl font-bold">{avgRoas.toFixed(1)}x</p>
            <p className="text-xs text-muted-foreground">return on ad spend</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold">{filteredCampaigns.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">of {filteredCampaigns.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    <button
                      onClick={() => toggleSort('name')}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      Campaign
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Platform</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Budget</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => toggleSort('spend')}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      Spend
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => toggleSort('conversions')}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      Conv.
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => toggleSort('roas')}
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      ROAS
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Trend</th>
                  <th className="px-4 py-3 text-right text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{campaign.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <PlatformBadge platform={campaign.platform} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(campaign.budget)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div>{formatCurrency(campaign.spend)}</div>
                      <div className="text-xs text-muted-foreground">
                        {((campaign.spend / campaign.budget) * 100).toFixed(0)}% used
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(campaign.conversions)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'font-semibold',
                          campaign.roas >= 4 && 'text-green-600',
                          campaign.roas >= 2 && campaign.roas < 4 && 'text-amber-600',
                          campaign.roas < 2 && campaign.roas > 0 && 'text-red-600'
                        )}
                      >
                        {campaign.roas > 0 ? `${campaign.roas.toFixed(1)}x` : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {campaign.trend === 'up' && (
                        <TrendingUp className="inline h-4 w-4 text-green-600" />
                      )}
                      {campaign.trend === 'down' && (
                        <TrendingDown className="inline h-4 w-4 text-red-600" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No campaigns found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
