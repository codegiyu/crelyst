import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { createTestimonial as createTestimonialRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const createTestimonialBodySchema = z.object({
  clientName: z.string().min(1, 'Client name is required').max(100),
  testimonial: z.string().min(1, 'Testimonial is required'),
  clientRole: z.string().max(100).optional(),
  companyName: z.string().max(100).optional(),
  companyLogo: z.string().optional(),
  clientImage: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const createTestimonial: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createTestimonialBodySchema, body);

  const newTestimonial = await createTestimonialRepo({
    clientName: payload.clientName,
    clientRole: payload.clientRole ?? '',
    companyName: payload.companyName ?? '',
    companyLogo: payload.companyLogo ?? '',
    clientImage: payload.clientImage ?? '',
    testimonial: payload.testimonial,
    rating: payload.rating ?? 5,
    isFeatured: payload.isFeatured ?? false,
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? 0,
  });

  if (!newTestimonial) {
    throw new AppError('Failed to create testimonial', 500);
  }

  revalidateAboutAndHome();

  return sendResponse(
    201,
    { testimonial: { ...newTestimonial, _id: newTestimonial.id } },
    'Testimonial created successfully'
  );
};
