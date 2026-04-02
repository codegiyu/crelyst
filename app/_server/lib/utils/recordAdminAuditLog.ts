import type { NextRequest } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { createAuditLog } from '../firestore/collections';
import { logger } from './logger';

/** Minimal user shape for audit (avoids circular import with routeHandler). */
type AuditActor = { _id?: string; email?: string } | null;

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function getRequestIp(request: NextRequest): string | null {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return null;
}

function actorFromUser(user: AuditActor): { id: string | null; email: string | null } {
  if (!user) return { id: null, email: null };
  if ('email' in user && typeof user.email === 'string' && user.email) {
    return { id: user._id ?? null, email: user.email };
  }
  return { id: user._id ?? null, email: null };
}

function loginEmailHint(body: Record<string, unknown>): string | null {
  const e = body?.email;
  return typeof e === 'string' ? e.toLowerCase().trim() : null;
}

export async function recordAdminAuditLog(params: {
  request: NextRequest;
  user: AuditActor;
  body: Record<string, unknown>;
  response: Response;
}) {
  try {
    const { request, user, body, response } = params;
    const method = request.method;
    if (method === 'OPTIONS' || method === 'HEAD') return;

    const url = new URL(request.url);
    const pathname = url.pathname;
    const status = response.status;

    const { id: actorId, email: actorEmail } = actorFromUser(user);
    let effectiveEmail = actorEmail;
    if (!user && method === 'POST' && pathname.includes('/admin/auth/login')) {
      const hint = loginEmailHint(body);
      if (hint) effectiveEmail = hint;
    }

    const clientIp = getRequestIp(request);
    const query = truncate(url.search, 500);
    const summary = `${method} ${pathname} ${status}`;
    const searchText = [
      method,
      pathname,
      query,
      String(status),
      actorId ?? '',
      effectiveEmail ?? '',
      clientIp ?? '',
      summary,
    ]
      .join(' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    await createAuditLog({
      method,
      path: pathname,
      query,
      statusCode: status,
      actorId,
      actorEmail: effectiveEmail,
      clientIp,
      summary,
      searchText,
      createdAt: Timestamp.now(),
    });
  } catch (err) {
    logger.error('recordAdminAuditLog failed', { err });
  }
}
