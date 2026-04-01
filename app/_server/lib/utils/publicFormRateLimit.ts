import { AppError } from './appError';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_WINDOW = 8;

function pruneStale(now: number) {
  for (const [k, b] of buckets) {
    if (now > b.resetAt + WINDOW_MS) buckets.delete(k);
  }
}

/**
 * Best-effort per-IP rate limit for public POST forms. In serverless, each instance
 * has its own map; combine with edge/WAF limits in production for stronger protection.
 */
export function assertPublicFormRateLimit(clientKey: string, routeId: string): void {
  const now = Date.now();
  if (buckets.size > 10_000) pruneStale(now);

  const key = `${routeId}:${clientKey}`;
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, b);
  }

  if (b.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    throw new AppError('Too many submissions. Please try again later.', 429, { retryAfterSec });
  }

  b.count += 1;
}

export function getClientIpForRateLimit(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  return first || request.headers.get('x-real-ip') || 'unknown';
}
