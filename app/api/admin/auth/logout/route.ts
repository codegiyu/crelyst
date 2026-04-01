import { NextResponse } from 'next/server';

const COOKIE = 'authToken';

/**
 * POST /api/admin/auth/logout
 * Clears HttpOnly authToken (client should also call Firebase signOut).
 */
export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out' }, { status: 200 });
  res.cookies.set(COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
