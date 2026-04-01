import { AppError } from './appError';
import type { ACCESS_TYPES } from '../types/constants';

/** For client detail routes: hide entities explicitly marked inactive (404). */
export function assertPublishedForClient(accessType: ACCESS_TYPES, entity: unknown): void {
  if (accessType !== 'client' || entity == null || typeof entity !== 'object') return;
  const o = entity as Record<string, unknown>;
  if (o.isActive === false) {
    throw new AppError('Not found', 404);
  }
}
