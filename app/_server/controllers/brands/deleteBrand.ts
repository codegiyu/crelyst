import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Brand } from '../../models/brand';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Delete brand (admin only)
export const deleteBrand = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Brand identifier is required', 400);
    }

    const brand = await Brand.findByIdAndDelete(identifier);

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    return sendResponse(200, null, 'Brand deleted successfully');
  })
);
