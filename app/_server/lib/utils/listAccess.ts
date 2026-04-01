import type { ACCESS_TYPES } from '../types/constants';

/**
 * Public list APIs: client defaults to active-only; admin (console) sees all unless
 * `isActive=true` or `isActive=false` is explicitly set in the query string.
 */
export function resolveListIsActiveQuery(
  accessType: ACCESS_TYPES,
  isActiveParam: string | null
): boolean | undefined {
  if (isActiveParam === 'true') return true;
  if (isActiveParam === 'false') return false;
  return accessType === 'client' ? true : undefined;
}
