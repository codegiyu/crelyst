import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Brand } from '../../models/brand';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Update brand (admin only)
export const updateBrand = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Brand identifier is required', 400);
    }

    const { name: newName, logo, websiteUrl, isActive, displayOrder } = body;

    // If name is being updated, check if new name already exists
    if (newName) {
      const existingBrand = await Brand.findOne({ name: newName });
      if (existingBrand && existingBrand._id.toString() !== identifier) {
        throw new AppError('Brand with this name already exists', 409);
      }
    }

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (newName !== undefined) updateData.name = newName;
    if (logo !== undefined) updateData.logo = logo;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const brand = await Brand.findByIdAndUpdate(identifier, updateData, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    return sendResponse(200, { brand }, 'Brand updated successfully');
  })
);
