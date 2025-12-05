import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Testimonial } from '../../models/testimonial';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Update testimonial (admin only)
export const updateTestimonial = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Testimonial identifier is required', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      throw new AppError('Invalid testimonial ID format', 400);
    }

    const {
      clientName,
      clientRole,
      companyName,
      companyLogo,
      clientImage,
      testimonial: testimonialText,
      rating,
      isFeatured,
      displayOrder,
      projectId,
    } = body;

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientRole !== undefined) updateData.clientRole = clientRole;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (companyLogo !== undefined) updateData.companyLogo = companyLogo;
    if (clientImage !== undefined) updateData.clientImage = clientImage;
    if (testimonialText !== undefined) updateData.testimonial = testimonialText;
    if (rating !== undefined) updateData.rating = rating;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (projectId !== undefined) {
      updateData.projectId = projectId ? new mongoose.Types.ObjectId(projectId) : null;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(identifier, updateData, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    return sendResponse(200, { testimonial }, 'Testimonial updated successfully');
  })
);
