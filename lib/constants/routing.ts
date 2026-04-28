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

export const unprotectedRoutes = new Set([
  '/admin/auth/login',
  '/admin/auth/accept-invite/create-password',
]);

/** `redirectTo` query param is a path (e.g. /admin/dashboard/home), not base64. */
export function safeAdminRedirectPath(redirectTo: string | null | undefined): string {
  const fallback = '/admin/dashboard/home';
  if (redirectTo == null || typeof redirectTo !== 'string') return fallback;
  const t = redirectTo.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return fallback;
  if (!t.startsWith('/admin')) return fallback;
  return t;
}

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
