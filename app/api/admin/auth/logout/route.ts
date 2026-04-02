import { NextResponse } from 'next/server';
import { ENVIRONMENT } from '@/lib/config/environment';

const COOKIE = 'authToken';

/**
 * POST /api/admin/auth/logout
 * Clears HttpOnly authToken (client should also call Firebase signOut).
 */
export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' }, { status: 200 });
  res.cookies.set(COOKIE, '', {
    httpOnly: true,
    secure: ENVIRONMENT.RUNTIME.IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
