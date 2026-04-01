import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { reorderBrands as reorderBrandsRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody, reorderBodySchema } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

export const reorderBrands: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(reorderBodySchema, body);

  const result = await reorderBrandsRepo(payload.reorderItems);

  revalidateAboutAndHome();

  return sendResponse(
    200,
    {
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    },
    'Brands reordered successfully'
  );
};
