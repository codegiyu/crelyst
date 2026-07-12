import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  buildAdminLoginUrl,
  isAdminDashboardPath,
  isAdminUnprotectedPath,
} from '@/lib/auth/adminRoutePaths';

const STYLEGUIDE_PATH = '/internal/styleguide';
const COOKIE_NAME = 'crelyst_styleguide';
const AUTH_COOKIE_NAME = 'authToken';
const CACHE_TTL_MS = 30_000;

let cachedMaintenanceMode: { value: boolean; expiresAt: number } | null = null;

async function styleguideToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function withPathnameHeader(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

async function isMaintenanceModeEnabled(request: NextRequest): Promise<boolean> {
  const now = Date.now();
  if (cachedMaintenanceMode && cachedMaintenanceMode.expiresAt > now) {
    return cachedMaintenanceMode.value;
  }

  try {
    const featuresUrl = new URL('/api/site-settings/features', request.url);
    const response = await fetch(featuresUrl, { cache: 'no-store' });
    if (!response.ok) return false;

    const json = (await response.json()) as {
      data?: { features?: { maintenanceMode?: boolean } };
    };
    const value = Boolean(json.data?.features?.maintenanceMode);
    cachedMaintenanceMode = { value, expiresAt: now + CACHE_TTL_MS };
    return value;
  } catch {
    return false;
  }
}

async function handleStyleguide(request: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const secret = process.env.STYLEGUIDE_SECRET?.trim();
  if (!secret) {
    return new NextResponse(null, { status: 404 });
  }

  const expected = await styleguideToken(secret);
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie === expected) {
    return NextResponse.next();
  }

  const key = request.nextUrl.searchParams.get('key');
  if (key === secret) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('key');
    const response = NextResponse.redirect(url);
    response.cookies.set(COOKIE_NAME, expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/internal',
    });
    return response;
  }

  return new NextResponse(null, { status: 404 });
}

function handleAdmin(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (isAdminUnprotectedPath(pathname)) {
    return withPathnameHeader(request, pathname);
  }

  if (isAdminDashboardPath(pathname)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL(buildAdminLoginUrl(pathname), request.url));
    }
  }

  return withPathnameHeader(request, pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(STYLEGUIDE_PATH)) {
    return handleStyleguide(request);
  }

  if (pathname.startsWith('/admin')) {
    return handleAdmin(request);
  }

  if (pathname.startsWith('/api') || pathname.startsWith('/maintenance')) {
    return NextResponse.next();
  }

  if (await isMaintenanceModeEnabled(request)) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/internal/styleguide',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
