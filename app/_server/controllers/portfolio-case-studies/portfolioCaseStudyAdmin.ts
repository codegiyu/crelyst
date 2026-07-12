import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getPortfolioCaseStudyBySlug,
  getPortfolioCaseStudyById,
  updatePortfolioCaseStudy,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { updatePortfolioCaseStudyBodySchema } from './schema';

export const getPortfolioCaseStudyAdmin: RouteHandler = async ({ request }) => {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Case study identifier is required', 400);
  }

  let caseStudy = await getPortfolioCaseStudyBySlug(identifier);
  if (!caseStudy) {
    caseStudy = await getPortfolioCaseStudyById(identifier);
  }
  if (!caseStudy) {
    throw new AppError('Case study not found', 404);
  }

  return sendResponse(
    200,
    { caseStudy: { ...caseStudy, _id: caseStudy.id } },
    'Portfolio case study fetched successfully'
  );
};

export const updatePortfolioCaseStudyAdmin: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Case study identifier is required', 400);
  }

  let existing = await getPortfolioCaseStudyBySlug(identifier);
  if (!existing) {
    existing = await getPortfolioCaseStudyById(identifier);
  }
  if (!existing) {
    throw new AppError('Case study not found', 404);
  }

  const payload = validateBody(updatePortfolioCaseStudyBodySchema, body);

  const existingRecord = existing as { id: string; slug?: string };
  if (payload.slug && payload.slug !== existingRecord.slug) {
    const slugTaken = await getPortfolioCaseStudyBySlug(payload.slug);
    if (slugTaken && slugTaken.id !== existingRecord.id) {
      throw new AppError('Case study with this slug already exists', 409);
    }
  }

  const updated = await updatePortfolioCaseStudy(existingRecord.id, payload);
  if (!updated) {
    throw new AppError('Failed to update case study', 500);
  }

  return sendResponse(
    200,
    { caseStudy: { ...updated, _id: updated.id } },
    'Portfolio case study updated successfully'
  );
};

export const deletePortfolioCaseStudyAdmin: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Case study identifier is required', 400);
  }

  let existing = await getPortfolioCaseStudyBySlug(identifier);
  if (!existing) {
    existing = await getPortfolioCaseStudyById(identifier);
  }
  if (!existing) {
    throw new AppError('Case study not found', 404);
  }

  const { deletePortfolioCaseStudy } = await import('../../lib/firestore/collections');
  const deleted = await deletePortfolioCaseStudy(existing.id);
  if (!deleted) {
    throw new AppError('Failed to delete case study', 500);
  }

  return sendResponse(200, { success: true }, 'Portfolio case study deleted successfully');
};
