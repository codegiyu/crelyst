import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Users,
  Star,
  LogOut,
  FolderKanban,
  UsersRound,
  Mail,
  UserPlus,
  Search,
  History,
} from 'lucide-react';
import type { ISidebarLinkGroup } from '@/lib/types/general';

export { unprotectedRoutes, safeAdminRedirectPath } from './admin-routing';

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
      {
        LucideIcon: Mail,
        page: 'Contact leads',
        path: { prefix: '/admin', suffix: '/dashboard/contact-leads' },
        inboxBadgeKey: 'quoteRequest',
      },
      {
        LucideIcon: UserPlus,
        page: 'Work with us',
        path: { prefix: '/admin', suffix: '/dashboard/work-with-us' },
        inboxBadgeKey: 'workWithUs',
      },
    ],
  },
  {
    groupName: 'System',
    links: [
      {
        LucideIcon: Search,
        page: 'Search',
        path: { prefix: '/admin', suffix: '/dashboard/search' },
      },
      {
        LucideIcon: History,
        page: 'Audit log',
        path: { prefix: '/admin', suffix: '/dashboard/audit-logs' },
      },
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
