import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBbsSiteContent } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { DEFAULT_BBS_SITE_CONTENT } from './schema';

function toClientContent(doc: Record<string, unknown> | null) {
  if (!doc) {
    return DEFAULT_BBS_SITE_CONTENT;
  }

  return {
    about: doc.about ?? DEFAULT_BBS_SITE_CONTENT.about,
    contact: doc.contact ?? DEFAULT_BBS_SITE_CONTENT.contact,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const getBbsSiteContentAdmin: RouteHandler = async ({ user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const doc = await getBbsSiteContent();

  return sendResponse(
    200,
    { content: toClientContent(doc as Record<string, unknown> | null) },
    'Bold Brand Studio site content fetched successfully'
  );
};
