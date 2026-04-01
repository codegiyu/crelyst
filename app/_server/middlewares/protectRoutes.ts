import { NextRequest } from 'next/server';
import { AppError } from '../lib/utils/appError';
import { ACCESS_TYPES } from '../lib/types/constants';
import {
  extractToken,
  getUserFromToken,
  resolveConsoleAdminFromToken,
} from '@/lib/middleware/auth';
import { ensureAdminProfile } from '../lib/auth/ensureAdminProfile';
import type { AdminProfile } from '@/lib/types/firestore-models';

/** Remove sensitive fields from user object before returning to client */
export const deleteFields = async <T extends Record<string, unknown>>(
  user: T,
  fields: string[]
): Promise<T> => {
  const obj = JSON.parse(JSON.stringify(user));
  for (const field of fields) {
    const parts = field.replace('+', '').split('.');
    try {
      let temp = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        temp = temp[parts[i]];
      }
      delete temp[parts[parts.length - 1]];
    } catch {
      // Field or parent does not exist
    }
  }
  return obj;
};

/** Returns user or throws on auth failure. */
export const protectRoutes = (accessType: ACCESS_TYPES) => async (req: NextRequest) => {
  const token = extractToken(req);

  if (!token) {
    throw new AppError('Unauthorized - No token provided', 401);
  }

  if (accessType === 'console') {
    const resolved = await resolveConsoleAdminFromToken(token);
    if (resolved.status === 'invalid_token') {
      throw new AppError('Invalid or expired token', 401);
    }
    if (resolved.status === 'forbidden') {
      throw new AppError('Admin access required', 403);
    }
    const profile = await ensureAdminProfile(resolved.user);
    return { ...profile, _id: profile.id } as AdminProfile & { _id: string };
  }

  const firebaseUser = await getUserFromToken(token);
  if (!firebaseUser) {
    throw new AppError('Invalid or expired token', 401);
  }

  return {
    _id: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName ?? undefined,
    photoURL: firebaseUser.photoURL ?? undefined,
  };
};
