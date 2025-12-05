import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Testimonial } from '../../models/testimonial';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Get single testimonial by ID (public)
export const getTestimonial = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Testimonial identifier is required', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      throw new AppError('Invalid testimonial ID format', 400);
    }

    const testimonial = await Testimonial.findById(identifier).lean();

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    return sendResponse(200, { testimonial }, 'Testimonial fetched successfully');
  })
);
