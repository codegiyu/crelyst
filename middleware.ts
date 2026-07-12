import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CACHE_TTL_MS = 30_000;

let cachedMaintenanceMode: { value: boolean; expiresAt: number } | null = null;

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance')
  ) {
    return NextResponse.next();
  }

  if (await isMaintenanceModeEnabled(request)) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
