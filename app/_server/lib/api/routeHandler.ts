/**
 * Direct route handler - replaces Express-like middleware composition.
 * Each API route calls this with (request, options, handler).
 */

import type { NextRequest } from 'next/server';
import { initializeApiReadiness } from '../init';
import { protectRoutes } from '../../middlewares/protectRoutes';
import { parseBody } from '../../middlewares/validateRequest';
import { errorHandler } from '../../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { recordAdminAuditLog } from '../utils/recordAdminAuditLog';
import { ACCESS_TYPES } from '../types/constants';
import type { AdminProfile } from '@/lib/types/firestore-models';

export type FirebaseClientUser = {
  _id: string;
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
};

export type AuthenticatedUser = (AdminProfile & { _id: string }) | FirebaseClientUser;

export type RouteContext = {
  request: NextRequest;
  user: AuthenticatedUser | null;
  body: Record<string, unknown>;
};

export type RouteHandler = (ctx: RouteContext) => Promise<Response>;

export type RouteOptions = {
  protect?: boolean;
  accessType?: ACCESS_TYPES;
  /** When true, skips Firestore audit log for this request (use sparingly). */
  skipAudit?: boolean;
};

export async function handleApiRoute(
  request: NextRequest,
  options: RouteOptions,
  handler: RouteHandler
): Promise<Response> {
  let response: Response;
  let user: AuthenticatedUser | null = null;
  let body: Record<string, unknown> = {};

  try {
    logger.info(`[${request.method}] ${request.url}`);
    await initializeApiReadiness().catch(err => logger.error('API readiness init failed:', err));

    if (options.protect && options.accessType) {
      user = await protectRoutes(options.accessType)(request);
    }

    body = await parseBody(request);

    response = await handler({ request, user, body });
  } catch (err: unknown) {
    response = errorHandler(err);
  }

  if (
    !options.skipAudit &&
    request.nextUrl.pathname.startsWith('/api/admin') &&
    request.method !== 'OPTIONS' &&
    request.method !== 'HEAD'
  ) {
    void recordAdminAuditLog({ request, user, body, response });
  }

  return response;
}
