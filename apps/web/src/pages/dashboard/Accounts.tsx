import { useState } from 'react';
import {
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  MoreVertical,
  Unplug,
  Settings2,
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

// Platform configurations
const platforms = [
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: '/icons/google-ads.svg',
    color: 'bg-blue-500',
    description: 'Search, Display, YouTube, Shopping',
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    icon: '/icons/meta.svg',
    color: 'bg-blue-600',
    description: 'Facebook, Instagram, Messenger',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    icon: '/icons/linkedin.svg',
    color: 'bg-sky-700',
    description: 'Sponsored Content, InMail, Display',
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    icon: '/icons/tiktok.svg',
    color: 'bg-gray-900',
    description: 'In-Feed, TopView, Brand Takeover',
  },
  {
    id: 'amazon',
    name: 'Amazon Ads',
    icon: '/icons/amazon.svg',
    color: 'bg-orange-500',
    description: 'Sponsored Products, Brands, Display',
  },
  {
    id: 'twitter',
    name: 'X (Twitter) Ads',
    icon: '/icons/twitter.svg',
    color: 'bg-gray-800',
    description: 'Promoted Tweets, Trends, Accounts',
  },
];

// Mock connected accounts
const connectedAccounts = [
  {
    id: 1,
    platform: 'google-ads',
    accountName: 'Acme Corp - Main',
    accountId: '123-456-7890',
    status: 'active',
    lastSync: '2 minutes ago',
    spend: 24500,
    campaigns: 12,
  },
  {
    id: 2,
    platform: 'meta',
    accountName: 'Acme Corp Facebook',
    accountId: 'act_1234567890',
    status: 'active',
    lastSync: '5 minutes ago',
    spend: 18200,
    campaigns: 8,
  },
  {
    id: 3,
    platform: 'linkedin',
    accountName: 'Acme Corp B2B',
    accountId: '507284629',
    status: 'warning',
    lastSync: '1 hour ago',
    spend: 5500,
    campaigns: 3,
    warningMessage: 'API rate limit approaching',
  },
  {
    id: 4,
    platform: 'tiktok',
    accountName: 'Acme TikTok',
    accountId: '7890123456',
    status: 'error',
    lastSync: '3 hours ago',
    spend: 0,
    campaigns: 0,
    errorMessage: 'Authentication expired',
  },
];

function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const config = platforms.find((p) => p.id === platform);

  // Fallback to colored circle with first letter
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg text-white font-bold',
        config?.color || 'bg-gray-500',
        className
      )}
    >
      {config?.name.charAt(0) || 'A'}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        status === 'active' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        status === 'warning' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        status === 'error' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      )}
    >
      {status === 'active' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'warning' && <AlertCircle className="h-3 w-3" />}
      {status === 'error' && <XCircle className="h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}

export default function Accounts() {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    setIsConnecting(platformId);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(null);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ad Accounts</h1>
          <p className="text-muted-foreground">
            Connect and manage your advertising platform accounts.
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Your linked advertising platform accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <PlatformIcon platform={account.platform} className="h-12 w-12" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{account.accountName}</p>
                      <StatusBadge status={account.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.accountId} • Last synced {account.lastSync}
                    </p>
                    {account.warningMessage && (
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        {account.warningMessage}
                      </p>
                    )}
                    {account.errorMessage && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {account.errorMessage}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">MTD Spend</p>
                      <p className="font-semibold">{formatCurrency(account.spend)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Campaigns</p>
                      <p className="font-semibold">{account.campaigns}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Sync now">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Settings">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="More options">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Connect New Platform</CardTitle>
          <CardDescription>
            Add more advertising platforms to manage from Ryze AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => {
              const isConnected = connectedAccounts.some(
                (acc) => acc.platform === platform.id
              );
              const isLoading = isConnecting === platform.id;

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={platform.id} className="h-10 w-10" />
                    <div>
                      <p className="font-medium">{platform.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {platform.description}
                      </p>
                    </div>
                  </div>
                  {isConnected ? (
                    <Button variant="outline" size="sm" disabled>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Connected
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(platform.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integration Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 h-fit">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Admin Access Required</p>
                <p className="text-sm text-muted-foreground">
                  Ensure you have admin access to the ad accounts you want to connect.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 h-fit">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Real-time Sync</p>
                <p className="text-sm text-muted-foreground">
                  Data syncs automatically every 15 minutes for active accounts.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="rounded-lg bg-primary/10 p-2 h-fit">
                <Unplug className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Secure Connection</p>
                <p className="text-sm text-muted-foreground">
                  We use OAuth 2.0 and never store your platform credentials.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
