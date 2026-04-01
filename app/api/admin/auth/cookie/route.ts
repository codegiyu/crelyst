import { NextRequest, NextResponse } from 'next/server';
import { resolveConsoleAdminFromToken } from '@/lib/middleware/auth';

const COOKIE = 'authToken';
const MAX_AGE_SEC = 55 * 60;

function cookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SEC,
  };
}

/**
 * POST /api/admin/auth/cookie
 * Sets HttpOnly authToken from a valid Firebase ID token (admin only).
 * Used so Server Components can call /api/admin/* with forwarded cookies.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idToken?: string };
    const idToken = body?.idToken;
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ message: 'idToken required' }, { status: 400 });
    }

    const resolved = await resolveConsoleAdminFromToken(idToken);
    if (resolved.status === 'invalid_token') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    if (resolved.status === 'forbidden') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE, idToken, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ message: 'Failed to set session cookie' }, { status: 500 });
  }
}
