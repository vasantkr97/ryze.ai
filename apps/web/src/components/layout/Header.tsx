import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  HelpCircle,
  CreditCard,
  Sparkles,
  Command,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info';
}

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  // const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Campaign completed',
      description: 'Your "Summer Sale" campaign has finished.',
      time: '5 min ago',
      read: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'ROAS milestone reached',
      description: 'Your campaigns achieved 4x ROAS this month!',
      time: '1 hour ago',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'New AI recommendation',
      description: 'Optimization suggestions are available.',
      time: '3 hours ago',
      read: true,
      type: 'info',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   document.documentElement.classList.toggle('dark', newTheme === 'dark');
  // };

  return (
    <header
      className={cn(
        'flex items-center h-16 px-4 border-b border-border/50 bg-background/80 backdrop-blur-xl',
        className
      )}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2 h-9 w-9 rounded-xl"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Search */}
      <div className="flex-1 flex items-center max-w-md">
        <button className="relative w-full group">
          <div className="flex items-center gap-3 w-full h-10 rounded-xl border border-border/50 bg-muted/30 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:border-primary/30">
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search campaigns, accounts...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 ml-4">
        {/* Theme toggle */}
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl hover:bg-muted/50"
        >
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button> */}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted/50">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <span className="font-semibold">Notifications</span>
              <Button variant="ghost" size="sm" className="text-xs h-auto px-2 py-1 text-primary hover:text-primary">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b border-border/50 last:border-0',
                      !notification.read && 'bg-primary/5'
                    )}
                  >
                    <div className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                      notification.type === 'success' && 'bg-emerald-500/10 text-emerald-500',
                      notification.type === 'warning' && 'bg-amber-500/10 text-amber-500',
                      notification.type === 'info' && 'bg-primary/10 text-primary'
                    )}>
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-tight">
                          {notification.title}
                        </span>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <span className="text-xs text-muted-foreground/70">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border/50">
              <Button variant="ghost" className="w-full h-9 text-sm" asChild>
                <Link to="/dashboard/notifications">
                  View all notifications
                </Link>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 ml-1">
              <Avatar className="h-8 w-8 ring-2 ring-border/50">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white text-xs font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/user.jpg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white text-sm font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link to="/dashboard/profile">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link to="/dashboard/billing">
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer gap-2">
              <Link to="/docs">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem> */}

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
