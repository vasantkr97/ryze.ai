import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Zap,
  TrendingUp,
  Target,
  Route,
  Palette,
  FileText,
  Settings,
  Sparkles,
  ChevronDown,
  Plus,
  Building2,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    href: '/dashboard/accounts',
    icon: Users,
  },
  {
    title: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Megaphone,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'AI Chat',
    href: '/dashboard/chat',
    icon: MessageSquare,
    badge: 'AI',
  },
  {
    title: 'Recommendations',
    href: '/dashboard/recommendations',
    icon: Lightbulb,
    badge: 'AI',
  },
  {
    title: 'Automation',
    href: '/dashboard/automation',
    icon: Zap,
  },
  {
    title: 'Predictions',
    href: '/dashboard/predictions',
    icon: TrendingUp,
    badge: 'AI',
  },
  {
    title: 'Competitors',
    href: '/dashboard/competitors',
    icon: Target,
  },
  {
    title: 'Journeys',
    href: '/dashboard/journeys',
    icon: Route,
  },
  {
    title: 'Creative Lab',
    href: '/dashboard/creative-lab',
    icon: Palette,
    badge: 'AI',
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

interface Workspace {
  id: string;
  name: string;
  logo?: string;
}

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const location = useLocation();
  const [workspaces] = React.useState<Workspace[]>([
    { id: '1', name: 'My Workspace' },
    { id: '2', name: 'Team Workspace' },
    { id: '3', name: 'Client Projects' },
  ]);
  const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace>(
    workspaces[0]
  );

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
          {!collapsed && <span className="font-bold text-lg">Ryze AI</span>}
        </Link>
      </div>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                <div className="flex items-center space-x-2 truncate">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{currentWorkspace.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className={cn(
                    'cursor-pointer',
                    workspace.id === currentWorkspace.id && 'bg-accent'
                  )}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/dashboard' &&
                location.pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Pro Plan</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Unlock advanced AI features and analytics
            </p>
            <Button size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
