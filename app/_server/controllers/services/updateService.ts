import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getServiceBySlug,
  getServiceById,
  updateService as updateServiceRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateServicePublic } from '../../lib/utils/revalidateSiteCache';
import { serviceUpdateBodySchema } from '../../lib/validation/serviceContent';

const UPDATABLE_FIELDS = [
  'title',
  'description',
  'shortDescription',
  'icon',
  'image',
  'cardImage',
  'bannerImage',
  'features',
  'isActive',
  'displayOrder',
  'seo',
  'pageTitle',
  'gallery',
  'expertise',
  'breakdownSummary',
  'whatMakesUsUnique',
  'process',
  'benefits',
  'packagePricing',
  'faq',
  'tags',
] as const;

export const updateService: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Service identifier is required', 400);
  }

  const payload = validateBody(serviceUpdateBodySchema, body);

  let current = await getServiceBySlug(identifier);
  if (!current) current = await getServiceById(identifier);
  if (!current) {
    throw new AppError('Service not found', 404);
  }

  const updateData: Record<string, unknown> = {};
  for (const key of UPDATABLE_FIELDS) {
    if (payload[key] !== undefined) updateData[key] = payload[key];
  }

  const service = await updateServiceRepo(current.id, updateData);

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  const updated = service as Record<string, unknown>;
  const slug = typeof updated.slug === 'string' ? updated.slug : identifier;
  revalidateServicePublic(slug);

  return sendResponse(
    200,
    { service: { ...service, _id: service.id } },
    'Service updated successfully'
  );
};
