import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { reorderServices as reorderServicesRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody, reorderBodySchema } from '../../lib/api/validateBody';
import { revalidateServicePublic } from '../../lib/utils/revalidateSiteCache';

export const reorderServices: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(reorderBodySchema, body);

  const result = await reorderServicesRepo(payload.reorderItems);

  revalidateServicePublic();

  return sendResponse(
    200,
    { modifiedCount: result.modifiedCount, matchedCount: result.matchedCount },
    'Services reordered successfully'
  );
};
