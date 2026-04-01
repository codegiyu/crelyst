import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { deleteBrand as deleteBrandRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

export const deleteBrand: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Brand identifier is required', 400);
  }

  const deleted = await deleteBrandRepo(identifier);

  if (!deleted) {
    throw new AppError('Brand not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(200, null, 'Brand deleted successfully');
};
