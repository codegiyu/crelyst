'use client';

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
import { User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { SidebarTrigger } from '../ui/sidebar';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useRouter } from 'next/navigation';

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-50 h-14 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="ml-0" />
      </div>
      <div className="flex-1" />

      {/* Profile menu */}
      <ProfileMenu />
    </header>
  );
};

const ProfileMenu = () => {
  const {
    user,
    actions: { logout },
  } = useAuthStore(state => state);
  const { theme, setTheme } = useTheme();
  const { push } = useRouter();

  const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto px-2 py-1">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar ?? ''} alt="User avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline-block">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{user?.email ?? ''}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => push('/admin/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => push('/admin/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-2">
          <RegularSelect
            label="Theme"
            value={theme || 'system'}
            onSelectChange={setTheme}
            options={
              [
                { text: 'Light', value: 'light' },
                { text: 'Dark', value: 'dark' },
                { text: 'System', value: 'system' },
              ] as SelectOption[]
            }
            wrapClassName="w-full"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 text-current" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
