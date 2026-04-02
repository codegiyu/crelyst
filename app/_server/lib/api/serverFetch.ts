import { cookies, headers } from 'next/headers';
import { ENVIRONMENT } from '@/lib/config/environment';
import { logger } from '../utils/logger';

const AUTH_COOKIE = 'authToken';

/** Default ISR window for public RSC internal fetches (site + listings). */
export const PUBLIC_RSC_REVALIDATE_SECONDS = 60;

type ApiEnvelope<T> = {
  status?: boolean;
  data?: T;
  message?: string;
  responseCode?: number;
};

/**
 * Absolute origin for server-side fetch to this app's API routes.
 * Prefer NEXT_PUBLIC_APP_URL in production so prerender/build does not rely on `headers()`.
 */
export async function getServerOrigin(): Promise<string> {
  const explicit = ENVIRONMENT.PUBLIC.APP_URL?.replace(/\/$/, '');
  if (explicit) return explicit;

  if (ENVIRONMENT.RUNTIME.VERCEL_URL) {
    return `https://${ENVIRONMENT.RUNTIME.VERCEL_URL}`;
  }

  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    if (host) {
      const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
      return `${proto}://${host}`;
    }
  } catch {
    // Prerender / static analysis paths where Request headers are unavailable
  }

  const port = ENVIRONMENT.RUNTIME.PORT;
  return `http://127.0.0.1:${port}`;
}

export type ServerFetchOptions = {
  /** Forward request cookies (needed for admin routes using authToken) */
  forwardAuthCookies?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
  /**
   * Next.js fetch revalidation (seconds). When a positive number, uses `next: { revalidate }`
   * instead of `cache: 'no-store'`. Use `false` to force no-store.
   */
  revalidate?: number | false;
};

export class ServerFetchError extends Error {
  constructor(
    message: string,
    public status: number,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ServerFetchError';
  }
}

/**
 * Calls an internal API route from a Server Component / server action.
 * Expects JSON shaped like sendResponse: { data, status, message, responseCode }.
 */
export async function serverFetchJson<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const {
    forwardAuthCookies = false,
    method = 'GET',
    body,
    cache = 'no-store',
    revalidate,
  } = options;

  const useNextRevalidate = typeof revalidate === 'number' && revalidate > 0;

  const origin = await getServerOrigin();
  const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`;

  const init: RequestInit = {
    method,
    ...(useNextRevalidate
      ? { next: { revalidate } }
      : { cache: revalidate === false ? 'no-store' : cache }),
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  if (forwardAuthCookies) {
    const cookieStore = await cookies();
    const pairs = cookieStore.getAll().map(c => `${c.name}=${encodeURIComponent(c.value)}`);
    if (pairs.length) {
      init.headers = {
        ...init.headers,
        Cookie: pairs.join('; '),
      };
    }
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let json: ApiEnvelope<T> | null = null;
  try {
    json = text ? (JSON.parse(text) as ApiEnvelope<T>) : null;
  } catch {
    throw new ServerFetchError('Invalid JSON from API', res.status);
  }

  if (!res.ok) {
    const msg = (json as { message?: string })?.message || `Request failed: ${res.status} ${path}`;
    throw new ServerFetchError(msg, res.status, json);
  }

  if (json?.data === undefined) {
    throw new ServerFetchError('Missing data in API response', res.status, json);
  }

  return json.data as T;
}

function isNextDynamicServerMessage(message: string): boolean {
  return message.includes('Dynamic server usage') || message.includes('used `headers`');
}

/**
 * Same as serverFetchJson but returns null on failure.
 * Defaults to ISR-style revalidation ({@link PUBLIC_RSC_REVALIDATE_SECONDS}) unless
 * `revalidate: false` is passed for always-fresh reads.
 */
export async function serverFetchJsonOrNull<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<T | null> {
  const revalidate =
    options.revalidate === undefined ? PUBLIC_RSC_REVALIDATE_SECONDS : options.revalidate;

  try {
    return await serverFetchJson<T>(path, { ...options, revalidate });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (isNextDynamicServerMessage(msg)) {
      return null;
    }
    if (e instanceof ServerFetchError) {
      logger.warn(`serverFetchJsonOrNull: ${path} failed (${e.status}): ${e.message}`);
    } else {
      logger.warn(`serverFetchJsonOrNull: ${path} failed: ${msg}`);
    }
    return null;
  }
}

export { AUTH_COOKIE };
