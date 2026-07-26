import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getPortfolioCaseStudyBySlug,
  getPortfolioCaseStudyById,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getPublicPortfolioCaseStudy: RouteHandler = async ({ request }) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Case study slug is required', 400);
  }

  let caseStudy = await getPortfolioCaseStudyBySlug(identifier);
  if (!caseStudy) {
    caseStudy = await getPortfolioCaseStudyById(identifier);
  }
  if (!caseStudy) {
    throw new AppError('Case study not found', 404);
  }

  assertPublishedForClient('client', caseStudy);

  return sendResponse(
    200,
    { caseStudy: { ...caseStudy, _id: caseStudy.id } },
    'Portfolio case study fetched successfully'
  );
};
