import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Testimonial } from '../../models/testimonial';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';
import mongoose from 'mongoose';

// List all testimonials (public)
export const listTestimonials = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const isFeatured = url.searchParams.get('isFeatured');
      const projectId = url.searchParams.get('projectId');
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const skip = (page - 1) * limit;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      // Only apply isActive filter for client requests, not console requests
      if (accessType !== 'console') {
        query.isActive = true;
      }
      if (isFeatured !== null) {
        query.isFeatured = isFeatured === 'true';
      }
      if (projectId) {
        query.projectId = new mongoose.Types.ObjectId(projectId);
      }

      const testimonials = await Testimonial.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Testimonial.countDocuments(query);

      return sendResponse(
        200,
        {
          testimonials,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        'Testimonials fetched successfully'
      );
    })
  );
