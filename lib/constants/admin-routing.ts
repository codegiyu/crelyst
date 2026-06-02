/** Admin route guards only — safe for Edge middleware (no client/store imports). */

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
