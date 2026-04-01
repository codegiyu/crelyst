/**
 * Admin emails – single source of truth for who is considered an admin.
 */

export const ADMIN_EMAILS = ['eomegbu@gmail.com', 'enemonaisaaconoja@gmail.com'] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  return typeof email === 'string' && (ADMIN_EMAILS as readonly string[]).includes(email);
}
