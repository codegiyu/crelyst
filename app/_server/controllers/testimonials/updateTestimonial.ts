import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getTestimonialById,
  updateTestimonial as updateTestimonialRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const updateTestimonialBodySchema = z.object({
  clientName: z.string().max(100).optional(),
  clientRole: z.string().max(100).optional(),
  companyName: z.string().max(100).optional(),
  companyLogo: z.string().optional(),
  clientImage: z.string().optional(),
  testimonial: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateTestimonial: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Testimonial identifier is required', 400);
  }

  const payload = validateBody(updateTestimonialBodySchema, body);

  const current = await getTestimonialById(identifier);
  if (!current) {
    throw new AppError('Testimonial not found', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = [
    'clientName',
    'clientRole',
    'companyName',
    'companyLogo',
    'clientImage',
    'testimonial',
    'rating',
    'isFeatured',
    'isActive',
    'displayOrder',
  ] as const;
  for (const f of fields) {
    const val = payload[f];
    if (val !== undefined) updateData[f] = val;
  }

  const testimonial = await updateTestimonialRepo(current.id, updateData);

  if (!testimonial) {
    throw new AppError('Testimonial not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(
    200,
    { testimonial: { ...testimonial, _id: testimonial.id } },
    'Testimonial updated successfully'
  );
};
