import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Brand } from '../../models/brand';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';

// Get single brand by ID (public)
export const getBrand = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const identifier = pathParts[pathParts.length - 1];

      if (!identifier) {
        throw new AppError('Brand identifier is required', 400);
      }

      const brand = await Brand.findById(identifier).lean();

      if (!brand) {
        throw new AppError('Brand not found', 404);
      }

      return sendResponse(200, { brand }, 'Brand fetched successfully');
    })
  );
