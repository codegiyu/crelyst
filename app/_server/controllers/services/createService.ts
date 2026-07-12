import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getServiceBySlug,
  createService as createServiceRepo,
} from '../../lib/firestore/collections';
import { slugify } from '../../lib/utils/slugify';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateServicePublic } from '../../lib/utils/revalidateSiteCache';
import { serviceWriteBodySchema } from '../../lib/validation/serviceContent';

const EXTENDED_FIELD_KEYS = [
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

export const createService: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(serviceWriteBodySchema, body);

  const finalSlug = payload.slug || slugify(payload.title);
  const existingService = await getServiceBySlug(finalSlug);
  if (existingService) {
    throw new AppError('Service with this slug already exists', 409);
  }

  const extendedFields = Object.fromEntries(
    EXTENDED_FIELD_KEYS.filter(key => payload[key] !== undefined).map(key => [key, payload[key]])
  );

  const service = await createServiceRepo({
    title: payload.title,
    slug: finalSlug,
    description: payload.description,
    shortDescription: payload.shortDescription ?? '',
    icon: payload.icon ?? '',
    image: payload.image ?? '',
    cardImage: payload.cardImage ?? '',
    bannerImage: payload.bannerImage ?? '',
    features: payload.features ?? [],
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? 0,
    seo: payload.seo ?? {},
    ...extendedFields,
  });

  if (!service) {
    throw new AppError('Failed to create service', 500);
  }

  revalidateServicePublic(finalSlug);

  return sendResponse(
    201,
    { service: { ...service, _id: service.id } },
    'Service created successfully'
  );
};
