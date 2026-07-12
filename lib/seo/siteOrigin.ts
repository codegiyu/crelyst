import { ENVIRONMENT } from '@/lib/config/environment';

/** Canonical origin without trailing slash (e.g. https://crelyst.com.ng). */
export function resolveSiteOrigin(): string {
  return ENVIRONMENT.SEO.LIVE_URL.replace(/\/$/, '');
}
