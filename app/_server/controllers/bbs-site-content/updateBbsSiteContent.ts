import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBbsSiteContent, setBbsSiteContent } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import {
  bbsSiteContentSchema,
  DEFAULT_BBS_SITE_CONTENT,
  mergeBbsSiteContent,
  updateBbsSiteContentBodySchema,
} from './schema';

export const updateBbsSiteContent: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(updateBbsSiteContentBodySchema, body);
  const existing = (await getBbsSiteContent()) as Record<string, unknown> | null;

  const nextContent = mergeBbsSiteContent(existing, {
    about: payload.about,
    contact: payload.contact,
    seo: payload.seo,
    projectsListingSeo: payload.projectsListingSeo,
  });

  const parsed = bbsSiteContentSchema.safeParse(nextContent);
  if (!parsed.success) {
    throw new AppError('Invalid Bold Brand Studio site content', 400);
  }

  const saved = (await setBbsSiteContent(parsed.data)) as unknown as {
    about: typeof parsed.data.about;
    contact: typeof parsed.data.contact;
    seo: typeof parsed.data.seo;
    projectsListingSeo: typeof parsed.data.projectsListingSeo;
    createdAt?: unknown;
    updatedAt?: unknown;
  };

  return sendResponse(
    200,
    {
      content: {
        about: saved.about,
        contact: saved.contact,
        seo: saved.seo ?? DEFAULT_BBS_SITE_CONTENT.seo,
        projectsListingSeo: saved.projectsListingSeo ?? DEFAULT_BBS_SITE_CONTENT.projectsListingSeo,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      },
    },
    'Bold Brand Studio site content updated successfully'
  );
};
