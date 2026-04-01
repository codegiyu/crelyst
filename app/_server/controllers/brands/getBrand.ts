import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBrandById } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getBrand =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Brand identifier is required', 400);
    }

    const brand = await getBrandById(identifier);
    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    assertPublishedForClient(accessType, brand);

    return sendResponse(200, { brand: { ...brand, _id: brand.id } }, 'Brand fetched successfully');
  };
