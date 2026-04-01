import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getTeamMemberById } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getTeamMember =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Team member identifier is required', 400);
    }

    const teamMember = await getTeamMemberById(identifier);

    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }

    assertPublishedForClient(accessType, teamMember);

    return sendResponse(
      200,
      { teamMember: { ...teamMember, _id: teamMember.id } },
      'Team member fetched successfully'
    );
  };
