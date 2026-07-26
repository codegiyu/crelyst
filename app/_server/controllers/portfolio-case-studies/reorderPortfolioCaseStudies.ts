import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { reorderPortfolioCaseStudies } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody, reorderBodySchema } from '../../lib/api/validateBody';

export const reorderPortfolioCaseStudiesAdmin: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(reorderBodySchema, body);
  const result = await reorderPortfolioCaseStudies(payload.reorderItems);

  return sendResponse(200, result, 'Portfolio case studies reordered successfully');
};
