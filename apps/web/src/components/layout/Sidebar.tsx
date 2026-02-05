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
  ChevronDown,
  Plus,
  Building2,
  Crown,
  ArrowRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
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
  isNew?: boolean;
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
    isNew: true,
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
        'flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border/50',
        collapsed ? 'w-16' : 'w-64',
        'transition-all duration-300 ease-out',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border/50">
        <Link to="/dashboard" className="flex items-center gap-3 group w-full">
           <Logo withText={!collapsed} />
        </Link>
      </div>

      {/* Workspace Switcher */}
      {!collapsed && (
        <div className="p-3 border-b border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-left font-normal h-11 px-3 bg-muted/30 hover:bg-accent/10 hover:text-foreground border border-border/50 text-foreground"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="truncate text-sm font-medium">{currentWorkspace.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => setCurrentWorkspace(workspace)}
                  className={cn(
                    'cursor-pointer gap-2.5',
                    workspace.id === currentWorkspace.id && 'bg-primary/10 text-primary'
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  {workspace.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2.5 text-muted-foreground">
                <Plus className="h-4 w-4" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item, index) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== '/dashboard' &&
              location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              style={{
                animationDelay: `${index * 30}ms`,
              }}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn(
                'h-4 w-4 flex-shrink-0 transition-transform',
                !isActive && 'group-hover:scale-110'
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && (
                    <span className={cn(
                      'px-1.5 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wide',
                      isActive
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary/15 text-primary'
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wide bg-chart-3/15 text-chart-3">
                      New
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Upgrade Card */}
      {!collapsed && (
        <div className="p-3 border-t border-border/50">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 border border-primary/20">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20">
                  <Crown className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-semibold">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Unlock unlimited AI insights and advanced automation
              </p>
              <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs h-8 font-semibold">
                Upgrade Now
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
