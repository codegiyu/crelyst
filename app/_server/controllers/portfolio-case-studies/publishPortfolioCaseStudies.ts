import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';

import { ENVIRONMENT } from '@/lib/config/environment';

export const publishPortfolioCaseStudies: RouteHandler = async ({ user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const hookUrl = ENVIRONMENT.BOLD_BRAND_STUDIO.DEPLOY_HOOK_URL;
  if (!hookUrl) {
    throw new AppError('Bold Brand Studio deploy hook is not configured', 503);
  }

  const response = await fetch(hookUrl, { method: 'POST' });
  if (!response.ok) {
    throw new AppError(`Deploy hook returned ${response.status}: ${response.statusText}`, 502);
  }

  let deployPayload: unknown = null;
  try {
    deployPayload = await response.json();
  } catch {
    deployPayload = { status: response.status };
  }

  return sendResponse(
    200,
    { triggered: true, deploy: deployPayload },
    'Bold Brand Studio rebuild triggered'
  );
};
