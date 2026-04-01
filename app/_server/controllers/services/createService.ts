import { z } from 'zod';
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

const seoSchema = z.object({
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

const createServiceBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  cardImage: z.string().optional(),
  bannerImage: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  seo: seoSchema.optional(),
});

export const createService: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createServiceBodySchema, body);

  const finalSlug = payload.slug || slugify(payload.title);
  const existingService = await getServiceBySlug(finalSlug);
  if (existingService) {
    throw new AppError('Service with this slug already exists', 409);
  }

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
