import { useState } from 'react';
import {
  Settings2,
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Users,
  Link2,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Key,
  Save,
  Check,
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

// Settings sections
const settingsSections = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'workspace', name: 'Workspace', icon: Building2 },
  { id: 'team', name: 'Team Members', icon: Users },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'integrations', name: 'Integrations', icon: Link2 },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'appearance', name: 'Appearance', icon: Palette },
];

// Team members
const teamMembers = [
  { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Admin', avatar: 'JD' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'Editor', avatar: 'SC' },
  { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'Viewer', avatar: 'MW' },
];

// Notification settings
const notificationSettings = [
  {
    category: 'Campaign Alerts',
    settings: [
      { id: 'budget_alerts', name: 'Budget alerts', description: 'When campaigns exceed budget thresholds', email: true, push: true },
      { id: 'performance_drops', name: 'Performance drops', description: 'Significant declines in ROAS or conversions', email: true, push: true },
      { id: 'automation_actions', name: 'Automation actions', description: 'When automation rules are triggered', email: false, push: true },
    ],
  },
  {
    category: 'AI Recommendations',
    settings: [
      { id: 'high_priority', name: 'High priority recommendations', description: 'Critical optimization opportunities', email: true, push: true },
      { id: 'weekly_insights', name: 'Weekly insights digest', description: 'Summary of AI-generated insights', email: true, push: false },
    ],
  },
  {
    category: 'Reports',
    settings: [
      { id: 'scheduled_reports', name: 'Scheduled reports', description: 'When scheduled reports are ready', email: true, push: false },
      { id: 'export_complete', name: 'Export complete', description: 'When data exports are ready to download', email: true, push: false },
    ],
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('workspace');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, workspace, and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <Card className="h-fit lg:w-64">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    activeSection === section.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Workspace Settings */}
          {activeSection === 'workspace' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Settings</CardTitle>
                  <CardDescription>
                    Manage your workspace name and general settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workspace Name</label>
                    <Input defaultValue="Acme Corp Marketing" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Workspace URL</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">ryze.ai/</span>
                      <Input defaultValue="acme-corp" className="max-w-[200px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option>E-commerce</option>
                      <option>SaaS</option>
                      <option>Agency</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <select className="w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>JPY - Japanese Yen</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Default Targets</CardTitle>
                  <CardDescription>
                    Set default performance targets for your campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target ROAS</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="3.0" />
                        <span className="text-sm text-muted-foreground">x</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target CPA</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input type="number" defaultValue="30" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target CTR</label>
                      <div className="flex items-center gap-2">
                        <Input type="number" defaultValue="2.5" />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Monthly Budget Cap</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input type="number" defaultValue="50000" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Team Settings */}
          {activeSection === 'team' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage who has access to this workspace
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="rounded-md border bg-background px-3 py-1.5 text-sm">
                          <option selected={member.role === 'Admin'}>Admin</option>
                          <option selected={member.role === 'Editor'}>Editor</option>
                          <option selected={member.role === 'Viewer'}>Viewer</option>
                        </select>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border-2 border-dashed p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    3 of 5 seats used on your current plan
                  </p>
                  <Button variant="link" size="sm">
                    Upgrade for more seats
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationSettings.map((category) => (
                  <div key={category.category}>
                    <h4 className="mb-3 font-semibold">{category.category}</h4>
                    <div className="space-y-3">
                      {category.settings.map((setting) => (
                        <div
                          key={setting.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div>
                            <p className="font-medium">{setting.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {setting.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                defaultChecked={setting.email}
                                className="rounded border-gray-300"
                              />
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                defaultChecked={setting.push}
                                className="rounded border-gray-300"
                              />
                              <Smartphone className="h-4 w-4 text-muted-foreground" />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Protect your account with additional security measures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">
                          2 active sessions on other devices
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage API keys for integrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Production API Key</p>
                        <p className="text-sm text-muted-foreground">
                          Created Jan 1, 2024 • Last used 2 hours ago
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          rzai_prod_****...****xY2k
                        </code>
                        <Button variant="ghost" size="sm">
                          Reveal
                        </Button>
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    <Key className="mr-2 h-4 w-4" />
                    Generate New Key
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Placeholder for other sections */}
          {['profile', 'integrations', 'billing', 'appearance'].includes(activeSection) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {settingsSections.find((s) => s.id === activeSection)?.name}
                </CardTitle>
                <CardDescription>
                  This section is under development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Settings2 className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Coming Soon</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This settings section will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
