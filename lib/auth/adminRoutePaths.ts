import { unprotectedRoutes } from '@/lib/constants/admin-routing';

export const ADMIN_LOGIN_PATH = '/admin/auth/login';
export const ADMIN_DASHBOARD_PREFIX = '/admin/dashboard';

export function isAdminUnprotectedPath(pathname: string): boolean {
  return unprotectedRoutes.has(pathname);
}

export function isAdminDashboardPath(pathname: string): boolean {
  return pathname === ADMIN_DASHBOARD_PREFIX || pathname.startsWith(`${ADMIN_DASHBOARD_PREFIX}/`);
}

/** Safe post-login redirect target (must stay under /admin). */
export function sanitizeAdminRedirectPath(redirectTo: string | null | undefined): string | null {
  if (redirectTo == null || typeof redirectTo !== 'string') return null;
  const t = redirectTo.trim();
  if (!t.startsWith('/') || t.startsWith('//')) return null;
  if (!t.startsWith('/admin')) return null;
  return t;
}

export function buildAdminLoginUrl(redirectTo?: string | null): string {
  const safe = sanitizeAdminRedirectPath(redirectTo ?? null);
  if (!safe) return ADMIN_LOGIN_PATH;
  return `${ADMIN_LOGIN_PATH}?redirectTo=${encodeURIComponent(safe)}`;
}
