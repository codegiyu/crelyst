import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Service } from '../../models/service';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';
import mongoose from 'mongoose';

// Get single service by slug or ID (public)
export const getService = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const identifier = pathParts[pathParts.length - 1];

      if (!identifier) {
        throw new AppError('Service identifier is required', 400);
      }

      const query = mongoose.Types.ObjectId.isValid(identifier)
        ? { _id: identifier }
        : { slug: identifier };

      const service = await Service.findOne(query).lean();

      if (!service) {
        throw new AppError('Service not found', 404);
      }

      return sendResponse(200, { service }, 'Service fetched successfully');
    })
  );
