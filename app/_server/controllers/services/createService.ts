import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Service } from '../../models/service';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Create service (admin only)
export const createService = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      title,
      slug,
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

    if (!title || !description) {
      throw new AppError('Title and description are required', 400);
    }

    // If slug is provided, check if it already exists
    if (slug) {
      const existingService = await Service.findOne({ slug });
      if (existingService) {
        throw new AppError('Service with this slug already exists', 409);
      }
    }

    // Create service - slug will be auto-generated if not provided
    const service = await Service.create({
      title,
      ...(slug && { slug }),
      description,
      shortDescription: shortDescription || '',
      icon: icon || '',
      image: image || '',
      cardImage: cardImage || '',
      bannerImage: bannerImage || '',
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
      seo: seo || {},
    });

    if (!service) {
      throw new AppError('Failed to create service', 500);
    }

    return sendResponse(201, { service }, 'Service created successfully');
  })
);
