import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';
import { AppError } from './appError';

function safeCompareStrings(a: string, b: string): boolean {
  const key = Buffer.alloc(32, 0);
  const ha = createHmac('sha256', key).update(a, 'utf8').digest();
  const hb = createHmac('sha256', key).update(b, 'utf8').digest();
  return ha.length === hb.length && timingSafeEqual(ha, hb);
}

/**
 * Require `WEBHOOK_SECRET` and a matching `x-webhook-secret` header or `Authorization: Bearer <secret>`.
 */
export function assertWebhookSecretConfigured(request: NextRequest): void {
  const secret = process.env.WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new AppError('Webhook is not configured', 503);
  }
  const header =
    request.headers.get('x-webhook-secret')?.trim() ||
    request.headers
      .get('authorization')
      ?.replace(/^Bearer\s+/i, '')
      .trim();
  if (!header || !safeCompareStrings(secret, header)) {
    throw new AppError('Unauthorized', 401);
  }
}
