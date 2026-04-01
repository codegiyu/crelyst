import { sendResponse } from '../../lib/utils/appResponse';
import { listProjects as listProjectsRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { resolveListIsActiveQuery } from '../../lib/utils/listAccess';

export const listProjects =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get('isActive');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const isActive = resolveListIsActiveQuery(accessType, isActiveParam);

    const { items: projects, total } = await listProjectsRepo({ isActive, limit, page });

    return sendResponse(
      200,
      {
        projects: projects.map(p => ({ ...p, _id: p.id })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Projects fetched successfully'
    );
  };
