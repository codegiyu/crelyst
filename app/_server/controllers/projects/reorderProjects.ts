import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { reorderProjects as reorderProjectsRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody, reorderBodySchema } from '../../lib/api/validateBody';
import { revalidateProjectPublic } from '../../lib/utils/revalidateSiteCache';

export const reorderProjects: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(reorderBodySchema, body);

  const result = await reorderProjectsRepo(payload.reorderItems);

  revalidateProjectPublic();

  return sendResponse(
    200,
    { modifiedCount: result.modifiedCount, matchedCount: result.matchedCount },
    'Projects reordered successfully'
  );
};
