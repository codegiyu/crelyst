import { z } from 'zod';
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

const seoSchema = z.object({
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

const updateServiceBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
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

  const payload = validateBody(updateServiceBodySchema, body);

  let current = await getServiceBySlug(identifier);
  if (!current) current = await getServiceById(identifier);
  if (!current) {
    throw new AppError('Service not found', 404);
  }

  const updateData: Record<string, unknown> = {};
  if (payload.title !== undefined) updateData.title = payload.title;
  if (payload.description !== undefined) updateData.description = payload.description;
  if (payload.shortDescription !== undefined)
    updateData.shortDescription = payload.shortDescription;
  if (payload.icon !== undefined) updateData.icon = payload.icon;
  if (payload.image !== undefined) updateData.image = payload.image;
  if (payload.cardImage !== undefined) updateData.cardImage = payload.cardImage;
  if (payload.bannerImage !== undefined) updateData.bannerImage = payload.bannerImage;
  if (payload.features !== undefined) updateData.features = payload.features;
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.displayOrder !== undefined) updateData.displayOrder = payload.displayOrder;
  if (payload.seo !== undefined) updateData.seo = payload.seo;

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
