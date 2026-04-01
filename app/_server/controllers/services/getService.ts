import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getServiceBySlug, getServiceById } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getService =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Service identifier is required', 400);
    }

    let service = await getServiceBySlug(identifier);
    if (!service) {
      service = await getServiceById(identifier);
    }

    if (!service) {
      throw new AppError('Service not found', 404);
    }

    assertPublishedForClient(accessType, service);

    return sendResponse(
      200,
      { service: { ...service, _id: service.id } },
      'Service fetched successfully'
    );
  };
