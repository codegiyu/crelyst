import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBbsSiteContent } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { bbsSiteContentSchema, mergeBbsSiteContent } from './schema';

export const getPublicBbsSiteContent: RouteHandler = async () => {
  const doc = (await getBbsSiteContent()) as Record<string, unknown> | null;
  const candidate = mergeBbsSiteContent(doc);
  const parsed = bbsSiteContentSchema.safeParse(candidate);

  if (!parsed.success) {
    throw new AppError('Bold Brand Studio site content is not configured', 503);
  }

  return sendResponse(
    200,
    { content: parsed.data },
    'Bold Brand Studio site content fetched successfully'
  );
};
