/**
 * Authentication middleware for route protection
 */

import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { isAdminEmail } from '@/lib/constants/admin-emails';
import { getDocument } from '@/lib/firebase/firestore';
import type { AdminProfile } from '@/lib/types/firestore-models';

function isLikelyTransientNetworkError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /timeout|ETIMEDOUT|ECONNRESET|ENOTFOUND|EAI_AGAIN/i.test(msg);
}

export type ConsoleAdminTokenResult =
  | { status: 'ok'; user: UserRecord; decoded: DecodedIdToken }
  | { status: 'invalid_token' }
  | { status: 'forbidden' };

/**
 * Single verification path for dashboard (console) admin: valid Firebase ID token,
 * plus allowlisted email or admin custom claims. Used by API routes and session.
 */
export async function resolveConsoleAdminFromToken(
  token: string
): Promise<ConsoleAdminTokenResult> {
  if (!adminAuth) return { status: 'invalid_token' };

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      const user = await adminAuth.getUser(decoded.uid);
      const isAdmin =
        isAdminEmail(user.email ?? undefined) || decoded.role === 'admin' || decoded.admin === true;
      if (!isAdmin) return { status: 'forbidden' };

      // Firestore accountStatus is the per-admin kill switch (suspension UI tracked separately).
      const profile = await getDocument<AdminProfile>('admins', decoded.uid);
      if (profile && profile.accountStatus !== 'active') {
        return { status: 'forbidden' };
      }

      return { status: 'ok', user, decoded };
    } catch (error) {
      console.error('Console admin token verification error:', error);
      if (attempt < maxAttempts && isLikelyTransientNetworkError(error)) {
        await new Promise(r => setTimeout(r, 400 * attempt));
        continue;
      }
      return { status: 'invalid_token' };
    }
  }

  return { status: 'invalid_token' };
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const r = await resolveConsoleAdminFromToken(token);
  return r.status === 'ok';
}

export async function verifyUserToken(token: string): Promise<boolean> {
  try {
    if (!adminAuth) return false;
    await adminAuth.verifyIdToken(token);
    return true;
  } catch (error) {
    console.error('User token verification error:', error);
    return false;
  }
}

export async function getUserFromToken(token: string) {
  if (!adminAuth) return null;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      return await adminAuth.getUser(decodedToken.uid);
    } catch (error) {
      console.error('Get user from token error:', error);
      if (attempt < maxAttempts && isLikelyTransientNetworkError(error)) {
        await new Promise(r => setTimeout(r, 400 * attempt));
        continue;
      }
      return null;
    }
  }
  return null;
}

export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const cookieToken = request.cookies.get('authToken')?.value;
  return cookieToken || null;
}

export async function protectAdminRoute(request: NextRequest): Promise<NextResponse | null> {
  const token = extractToken(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
  }
  const isAdmin = await verifyAdminToken(token);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
  }
  return null;
}

export async function protectUserRoute(request: NextRequest): Promise<NextResponse | null> {
  const token = extractToken(request);
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
  }
  const isValid = await verifyUserToken(token);
  if (!isValid) {
    return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 403 });
  }
  return null;
}
