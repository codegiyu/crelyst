/**
 * CORS for Bold Brand Studio public portfolio API.
 * Allows explicit origins only — no wildcard.
 */

import { ENVIRONMENT } from '@/lib/config/environment';

const DEFAULT_BOLD_BRAND_STUDIO_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://bold-brand-studio.vercel.app',
  'https://www.boldbrandstudio.com',
];

function parseOriginsFromEnv(): string[] {
  const raw = process.env.BOLD_BRAND_STUDIO_ALLOWED_ORIGINS?.trim();
  if (!raw) return DEFAULT_BOLD_BRAND_STUDIO_ORIGINS;
  return raw
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
}

/** Vercel preview deployments for Bold Brand Studio (project-specific pattern). */
function isAllowedVercelPreview(origin: string): boolean {
  return /^https:\/\/bold-brand-studio[a-z0-9-]*\.vercel\.app$/i.test(origin);
}

export function isBoldBrandStudioOrigin(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = parseOriginsFromEnv();
  if (allowed.includes(origin)) return true;
  if (ENVIRONMENT.RUNTIME.IS_DEVELOPMENT && origin.startsWith('http://localhost:')) return true;
  return isAllowedVercelPreview(origin);
}

export function corsHeadersForOrigin(origin: string | null): Record<string, string> {
  if (!isBoldBrandStudioOrigin(origin)) {
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin!,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function withPortfolioCors(response: Response, origin: string | null): Response {
  const headers = corsHeadersForOrigin(origin);
  if (Object.keys(headers).length === 0) {
    return response;
  }

  const next = new Response(response.body, response);
  for (const [key, value] of Object.entries(headers)) {
    next.headers.set(key, value);
  }
  return next;
}
