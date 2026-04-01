import { sendResponse } from '../../lib/utils/appResponse';
import { listTeamMembers as listTeamMembersRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { resolveListIsActiveQuery } from '../../lib/utils/listAccess';

export const listTeamMembers =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const isActiveParam = url.searchParams.get('isActive');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const isActive = resolveListIsActiveQuery(accessType, isActiveParam);

    const { items: teamMembers, total } = await listTeamMembersRepo({ isActive, limit, page });

    return sendResponse(
      200,
      {
        teamMembers: teamMembers.map(t => ({ ...t, _id: t.id })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Team members fetched successfully'
    );
  };
