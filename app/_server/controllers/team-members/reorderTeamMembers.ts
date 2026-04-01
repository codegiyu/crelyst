import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { reorderTeamMembers as reorderTeamMembersRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody, reorderBodySchema } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

export const reorderTeamMembers: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(reorderBodySchema, body);

  const result = await reorderTeamMembersRepo(payload.reorderItems);

  revalidateAboutAndHome();

  return sendResponse(
    200,
    { modifiedCount: result.modifiedCount, matchedCount: result.matchedCount },
    'Team members reordered successfully'
  );
};
