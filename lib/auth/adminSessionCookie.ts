const COOKIE_URL = '/api/admin/auth/cookie';
const LOGOUT_URL = '/api/admin/auth/logout';

/** Sets HttpOnly authToken when idToken is a valid admin Firebase token. */
export async function syncAdminSessionCookie(idToken: string): Promise<boolean> {
  const res = await fetch(COOKIE_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  return res.ok;
}

export async function clearAdminSessionCookie(): Promise<void> {
  await fetch(LOGOUT_URL, { method: 'POST', credentials: 'include' });
}
