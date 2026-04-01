import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getProjectBySlug,
  getProjectById,
  deleteProject as deleteProjectRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { revalidateProjectPublic } from '../../lib/utils/revalidateSiteCache';

export const deleteProject: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Project identifier is required', 400);
  }

  let current = await getProjectBySlug(identifier);
  if (!current) current = await getProjectById(identifier);
  if (!current) {
    throw new AppError('Project not found', 404);
  }

  const cur = current as Record<string, unknown>;
  const slugForCache = typeof cur.slug === 'string' ? cur.slug : identifier;

  const deleted = await deleteProjectRepo(current.id);

  if (!deleted) {
    throw new AppError('Project not found', 404);
  }

  revalidateProjectPublic(slugForCache);

  return sendResponse(200, null, 'Project deleted successfully');
};
