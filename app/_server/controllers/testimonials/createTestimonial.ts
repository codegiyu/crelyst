import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Testimonial } from '../../models/testimonial';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Create testimonial (admin only)
export const createTestimonial = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      clientName,
      clientRole,
      companyName,
      companyLogo,
      clientImage,
      testimonial,
      rating,
      isFeatured,
      displayOrder,
      projectId,
    } = body;

    if (!clientName || !testimonial) {
      throw new AppError('Client name and testimonial are required', 400);
    }

    const newTestimonial = await Testimonial.create({
      clientName,
      clientRole: clientRole || '',
      companyName: companyName || '',
      companyLogo: companyLogo || '',
      clientImage: clientImage || '',
      testimonial,
      rating: rating || 5,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      displayOrder: displayOrder || 0,
      projectId: projectId ? new mongoose.Types.ObjectId(projectId) : null,
    });

    if (!newTestimonial) {
      throw new AppError('Failed to create testimonial', 500);
    }

    return sendResponse(201, { testimonial: newTestimonial }, 'Testimonial created successfully');
  })
);
