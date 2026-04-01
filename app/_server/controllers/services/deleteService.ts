import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getServiceBySlug,
  getServiceById,
  deleteService as deleteServiceRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { revalidateServicePublic } from '../../lib/utils/revalidateSiteCache';

export const deleteService: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Service identifier is required', 400);
  }

  let current = await getServiceBySlug(identifier);
  if (!current) current = await getServiceById(identifier);
  if (!current) {
    throw new AppError('Service not found', 404);
  }

  const cur = current as Record<string, unknown>;
  const slugForCache = typeof cur.slug === 'string' ? cur.slug : identifier;

  const deleted = await deleteServiceRepo(current.id);

  if (!deleted) {
    throw new AppError('Service not found', 404);
  }

  revalidateServicePublic(slugForCache);

  return sendResponse(200, null, 'Service deleted successfully');
};
