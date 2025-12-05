import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Brand } from '../../models/brand';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Create brand (admin only)
export const createBrand = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, logo, websiteUrl, isActive, displayOrder } = body;

    if (!name || !logo) {
      throw new AppError('Name and logo are required', 400);
    }

    // Check if name already exists
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      throw new AppError('Brand with this name already exists', 409);
    }

    const brand = await Brand.create({
      name,
      logo,
      websiteUrl: websiteUrl || '',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    if (!brand) {
      throw new AppError('Failed to create brand', 500);
    }

    return sendResponse(201, { brand }, 'Brand created successfully');
  })
);
