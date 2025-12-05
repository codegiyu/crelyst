import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Users,
  Star,
  LogOut,
  FolderKanban,
  UsersRound,
} from 'lucide-react';
import type { ISidebarLinkGroup } from '@/lib/types/general';

export const unprotectedRoutes = new Set([
  '/admin/auth/login',
  '/admin/auth/accept-invite/create-password',
]);

export const authenticatedAuthRoutes = new Set<string>([]);
export const noAuthCheckRoutes: string[] = [];

export const sidebarLinksData: ISidebarLinkGroup[] = [
  {
    groupName: 'Main',
    links: [
      {
        LucideIcon: LayoutDashboard,
        page: 'Dashboard',
        path: { prefix: '/admin', suffix: '/dashboard/home' },
      },
      {
        LucideIcon: Briefcase,
        page: 'Services',
        path: { prefix: '/admin', suffix: '/dashboard/services' },
      },
      {
        LucideIcon: FolderKanban,
        page: 'Projects',
        path: { prefix: '/admin', suffix: '/dashboard/projects' },
      },
      {
        LucideIcon: Users,
        page: 'Brands',
        path: { prefix: '/admin', suffix: '/dashboard/brands' },
      },
      {
        LucideIcon: Star,
        page: 'Testimonials',
        path: { prefix: '/admin', suffix: '/dashboard/testimonials' },
      },
      {
        LucideIcon: UsersRound,
        page: 'Team',
        path: { prefix: '/admin', suffix: '/dashboard/team' },
      },
    ],
  },
  {
    groupName: 'System',
    links: [
      {
        LucideIcon: Settings,
        page: 'Settings',
        path: { prefix: '/admin', suffix: '/dashboard/settings' },
      },
    ],
  },
];

export const bottomBarLinks: ISidebarLinkGroup = {
  groupName: '',
  links: [
    {
      LucideIcon: LogOut,
      page: 'Logout',
      action: () => {
        // Import dynamically to avoid circular dependency
        import('@/lib/store/useAuthStore').then(({ useInitAuthStore }) => {
          useInitAuthStore.getState().actions.logout();
        });
      },
    },
  ],
};

export const pageHeadingsData = {} as const;
