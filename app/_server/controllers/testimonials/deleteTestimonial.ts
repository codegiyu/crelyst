import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getTestimonialById,
  deleteTestimonial as deleteTestimonialRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

export const deleteTestimonial: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Testimonial identifier is required', 400);
  }

  const current = await getTestimonialById(identifier);
  if (!current) {
    throw new AppError('Testimonial not found', 404);
  }

  const deleted = await deleteTestimonialRepo(current.id);

  if (!deleted) {
    throw new AppError('Testimonial not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(200, { success: true }, 'Testimonial deleted successfully');
};
