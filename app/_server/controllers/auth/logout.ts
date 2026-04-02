import { cookies } from 'next/headers';
import { ENVIRONMENT } from '@/lib/config/environment';
import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';

const AUTH_COOKIE = 'authToken';

/**
 * Clears HttpOnly Firebase session cookie. Client should also call Firebase signOut.
 */
export const logout: RouteHandler = async () => {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: ENVIRONMENT.RUNTIME.IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return sendResponse(200, { success: true }, 'Logged out successfully');
};
