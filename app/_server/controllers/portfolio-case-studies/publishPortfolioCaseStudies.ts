import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { ENVIRONMENT } from '@/lib/config/environment';
import { getBbsSiteContent, setBbsSiteContent } from '../../lib/firestore/collections';
import {
  extractDeploymentIdFromHookPayload,
  fetchLatestVercelDeploymentSince,
  isVercelDeployStatusConfigured,
} from '../../lib/utils/vercelBbsDeploy';
import type { BbsPublishMeta } from '@/lib/admin/bbsPublishStatus';

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

  const triggeredAt = new Date().toISOString();
  let deploymentId = extractDeploymentIdFromHookPayload(deployPayload);

  if (!deploymentId && isVercelDeployStatusConfigured()) {
    try {
      const latest = await fetchLatestVercelDeploymentSince(Date.parse(triggeredAt));
      deploymentId = latest?.id ?? null;
    } catch {
      // Content cues still work without a deployment id.
    }
  }

  const existing = (await getBbsSiteContent()) as Record<string, unknown> | null;
  const previousMeta = (existing?.publishMeta as BbsPublishMeta | undefined) ?? {};

  const publishMeta: BbsPublishMeta = {
    ...previousMeta,
    lastPublishTriggeredAt: triggeredAt,
    lastDeploymentId: deploymentId ?? previousMeta.lastDeploymentId ?? null,
    lastDeployStatus: deploymentId ? 'BUILDING' : (previousMeta.lastDeployStatus ?? null),
  };

  await setBbsSiteContent({ publishMeta });

  return sendResponse(
    200,
    { triggered: true, deploy: deployPayload, publishMeta },
    'Bold Brand Studio rebuild triggered'
  );
};
