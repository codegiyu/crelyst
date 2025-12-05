import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Service } from '../../models/service';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Update service (admin only)
export const updateService = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Service identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const {
      title,
      description,
      shortDescription,
      icon,
      image,
      cardImage,
      bannerImage,
      features,
      isActive,
      displayOrder,
      seo,
    } = body;

    // Check if service exists and validate slug uniqueness if slug is being updated
    const currentService = await Service.findOne(query).select('slug').lean();
    if (!currentService) {
      throw new AppError('Service not found', 404);
    }

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (icon !== undefined) updateData.icon = icon;
    if (image !== undefined) updateData.image = image;
    if (cardImage !== undefined) updateData.cardImage = cardImage;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (features !== undefined) updateData.features = features;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (seo !== undefined) updateData.seo = seo;

    const service = await Service.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    return sendResponse(200, { service }, 'Service updated successfully');
  })
);
