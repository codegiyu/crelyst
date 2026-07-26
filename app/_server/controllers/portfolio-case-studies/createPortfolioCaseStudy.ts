import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getPortfolioCaseStudyBySlug,
  createPortfolioCaseStudy as createRepo,
  getNextDisplayOrder,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { createPortfolioCaseStudyBodySchema } from './schema';
import { slugify } from '../../lib/utils/slugify';

export const createPortfolioCaseStudy: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createPortfolioCaseStudyBodySchema, body);
  const finalSlug = (payload.slug && payload.slug.trim()) || slugify(payload.title);
  const existing = await getPortfolioCaseStudyBySlug(finalSlug);
  if (existing) {
    throw new AppError('Case study with this slug already exists', 409);
  }

  const { isActive, displayOrder, slug: _slug, ...content } = payload;
  const caseStudy = await createRepo({
    ...content,
    slug: finalSlug,
    isActive: isActive ?? true,
    displayOrder: displayOrder ?? (await getNextDisplayOrder('portfolioCaseStudies')),
  });

  if (!caseStudy) {
    throw new AppError('Failed to create case study', 500);
  }

  return sendResponse(
    201,
    { caseStudy: { ...caseStudy, _id: caseStudy.id } },
    'Portfolio case study created successfully'
  );
};
