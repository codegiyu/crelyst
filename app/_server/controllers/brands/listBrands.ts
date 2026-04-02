import { sendResponse } from '../../lib/utils/appResponse';
import { listBrands as listBrandsRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { resolveListIsActiveQuery } from '../../lib/utils/listAccess';

export const listBrands =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get('isActive');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const isActive = resolveListIsActiveQuery(accessType, isActiveParam);

    const { items: brands, total } = await listBrandsRepo({
      isActive,
      limit,
      page,
    });

    return sendResponse(
      200,
      {
        brands: brands.map(b => ({ ...b, _id: b.id })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Brands fetched successfully'
    );
  };
