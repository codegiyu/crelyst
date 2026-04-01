import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getTestimonialById } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getTestimonial =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Testimonial identifier is required', 400);
    }

    const testimonial = await getTestimonialById(identifier);

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    assertPublishedForClient(accessType, testimonial);

    return sendResponse(
      200,
      { testimonial: { ...testimonial, _id: testimonial.id } },
      'Testimonial fetched successfully'
    );
  };
