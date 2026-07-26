import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBbsSiteContent, setBbsSiteContent } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import {
  bbsSiteContentSchema,
  DEFAULT_BBS_SITE_CONTENT,
  updateBbsSiteContentBodySchema,
} from './schema';

export const updateBbsSiteContent: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(updateBbsSiteContentBodySchema, body);
  const existing = (await getBbsSiteContent()) as Record<string, unknown> | null;

  const nextContent = {
    about: payload.about ?? existing?.about ?? DEFAULT_BBS_SITE_CONTENT.about,
    contact: payload.contact ?? existing?.contact ?? DEFAULT_BBS_SITE_CONTENT.contact,
  };

  const parsed = bbsSiteContentSchema.safeParse(nextContent);
  if (!parsed.success) {
    throw new AppError('Invalid Bold Brand Studio site content', 400);
  }

  const saved = (await setBbsSiteContent(parsed.data)) as unknown as {
    about: typeof parsed.data.about;
    contact: typeof parsed.data.contact;
    createdAt?: unknown;
    updatedAt?: unknown;
  };

  return sendResponse(
    200,
    {
      content: {
        about: saved.about,
        contact: saved.contact,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
    },
    'Bold Brand Studio site content updated successfully'
  );
};
