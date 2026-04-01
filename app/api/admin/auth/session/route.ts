import { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { extractToken, resolveConsoleAdminFromToken } from '@/lib/middleware/auth';
import { ensureAdminProfile } from '@/app/_server/lib/auth/ensureAdminProfile';
import { sendResponse } from '@/app/_server/lib/utils/appResponse';

const LOG_PREFIX = '[api/admin/auth/session]';

/**
 * GET /api/admin/auth/session
 * Validates Firebase token and returns admin profile.
 * Returns { admin: null } if no/invalid token or user is not an admin.
 */
export async function GET(request: NextRequest) {
  let step = 'start';

  try {
    step = 'extractToken';
    const token = extractToken(request);

    if (!token) {
      console.warn(LOG_PREFIX, 'exit: no token');
      return sendResponse(200, { admin: null }, 'No active session');
    }

    step = 'adminAuth';
    if (!adminAuth) {
      console.warn(LOG_PREFIX, 'exit: adminAuth not initialized');
      return sendResponse(200, { admin: null }, 'Auth not configured');
    }

    step = 'resolveConsoleAdminFromToken';
    const resolved = await resolveConsoleAdminFromToken(token);
    if (resolved.status === 'invalid_token') {
      console.warn(LOG_PREFIX, 'exit: invalid or unverifiable token');
      return sendResponse(200, { admin: null }, 'Invalid token');
    }
    if (resolved.status === 'forbidden') {
      console.warn(LOG_PREFIX, 'exit: not a console admin');
      return sendResponse(200, { admin: null }, 'Admin access required');
    }

    step = 'ensureAdminProfile';
    let profile;
    try {
      profile = await ensureAdminProfile(resolved.user);
    } catch (e) {
      console.error(LOG_PREFIX, 'exit: ensureAdminProfile failed', e);
      return sendResponse(200, { admin: null }, 'Profile not found');
    }

    step = 'sendResponse';
    const admin = { ...profile, _id: profile.id };

    return sendResponse(200, { admin }, 'Session retrieved');
  } catch (error) {
    console.error(LOG_PREFIX, 'threw during step:', step, error);
    return sendResponse(200, { admin: null }, 'Session error');
  }
}
