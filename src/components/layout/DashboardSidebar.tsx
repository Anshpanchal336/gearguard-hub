import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types/database';
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  HardHat,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const roleIcons: Record<AppRole, React.ReactNode> = {
  user: <User className="h-4 w-4" />,
  technician: <HardHat className="h-4 w-4" />,
  manager: <Shield className="h-4 w-4" />,
};

const roleLabels: Record<AppRole, string> = {
  user: 'User',
  technician: 'Technician',
  manager: 'Manager',
};

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: AppRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
    roles: ['user', 'technician', 'manager'],
  },
  {
    label: 'New Request',
    icon: <Wrench className="h-5 w-5" />,
    href: '/dashboard/new-request',
    roles: ['user'],
  },
  {
    label: 'My Requests',
    icon: <ClipboardList className="h-5 w-5" />,
    href: '/dashboard/requests',
    roles: ['user'],
  },
  {
    label: 'All Requests',
    icon: <ClipboardList className="h-5 w-5" />,
    href: '/dashboard/all-requests',
    roles: ['technician', 'manager'],
  },
  {
    label: 'Team',
    icon: <Users className="h-5 w-5" />,
    href: '/dashboard/team',
    roles: ['manager'],
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/dashboard/settings',
    roles: ['user', 'technician', 'manager'],
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, userRole, updateRole, signOut } = useAuth();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const handleRoleChange = async (newRole: AppRole) => {
    const { error } = await updateRole(newRole);
    if (!error) {
      navigate('/dashboard');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">
              GearGuard
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Role Selector */}
      {!collapsed && (
        <div className="p-4">
          <label className="text-xs font-medium text-sidebar-foreground/60 mb-2 block">
            Current Role
          </label>
          <Select value={userRole || 'user'} onValueChange={(v) => handleRoleChange(v as AppRole)}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(['user', 'technician', 'manager'] as AppRole[]).map((role) => (
                <SelectItem key={role} value={role}>
                  <div className="flex items-center gap-2">
                    {roleIcons[role]}
                    <span>{roleLabels[role]}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                isActive && 'bg-sidebar-accent text-sidebar-primary font-medium',
                collapsed && 'justify-center'
              )
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent">
              <User className="h-5 w-5 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {profile?.email}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            'w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'px-0'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
