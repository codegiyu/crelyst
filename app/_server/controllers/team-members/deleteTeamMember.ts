import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getTeamMemberById,
  deleteTeamMember as deleteTeamMemberRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

export const deleteTeamMember: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Team member identifier is required', 400);
  }

  const current = await getTeamMemberById(identifier);
  if (!current) {
    throw new AppError('Team member not found', 404);
  }

  const deleted = await deleteTeamMemberRepo(current.id);

  if (!deleted) {
    throw new AppError('Team member not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(200, null, 'Team member deleted successfully');
};
