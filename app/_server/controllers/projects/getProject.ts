import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getProjectBySlug, getProjectById } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { assertPublishedForClient } from '../../lib/utils/clientPublished';

export const getProject =
  (accessType: ACCESS_TYPES = 'client'): RouteHandler =>
  async ({ request }) => {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Project identifier is required', 400);
    }

    let project = await getProjectBySlug(identifier);
    if (!project) {
      project = await getProjectById(identifier);
    }
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    assertPublishedForClient(accessType, project);

    return sendResponse(
      200,
      { project: { ...project, _id: project.id } },
      'Project fetched successfully'
    );
  };
