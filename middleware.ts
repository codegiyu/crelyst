import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const STYLEGUIDE_PATH = '/internal/styleguide';
const COOKIE_NAME = 'crelyst_styleguide';

async function styleguideToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith(STYLEGUIDE_PATH)) {
    return NextResponse.next();
  }

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

export const config = {
  matcher: '/internal/styleguide',
};
