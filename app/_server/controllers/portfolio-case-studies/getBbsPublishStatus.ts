import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';
import {
  getBbsSiteContent,
  listPortfolioCaseStudies,
  setBbsSiteContent,
} from '../../lib/firestore/collections';
import {
  bbsPublishTooltip,
  getBbsContentPublishState,
  mapVercelDeployState,
  resolveBbsPublishUiState,
  toMillis,
  type BbsPublishMeta,
  type BbsPublishUiState,
} from '@/lib/admin/bbsPublishStatus';
import {
  fetchVercelDeployment,
  isVercelDeployStatusConfigured,
} from '../../lib/utils/vercelBbsDeploy';

async function resolveContentUpdatedAt(): Promise<number | null> {
  const [siteDoc, caseStudies] = await Promise.all([
    getBbsSiteContent(),
    listPortfolioCaseStudies({ limit: 100 }),
  ]);

  const timestamps: number[] = [];
  const siteMs = toMillis((siteDoc as Record<string, unknown> | null)?.updatedAt);
  if (siteMs != null) timestamps.push(siteMs);

  for (const study of caseStudies.items) {
    const ms = toMillis((study as Record<string, unknown>).updatedAt);
    if (ms != null) timestamps.push(ms);
  }

  if (!timestamps.length) return null;

  return Math.max(...timestamps);
}

export const getBbsPublishStatus: RouteHandler = async ({ user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const siteDoc = (await getBbsSiteContent()) as Record<string, unknown> | null;
  let publishMeta = (siteDoc?.publishMeta as BbsPublishMeta | undefined) ?? {};
  const contentUpdatedAt = await resolveContentUpdatedAt();

  let deployReadyState: string | null = publishMeta.lastDeployStatus ?? null;
  let deployConfigured = isVercelDeployStatusConfigured();

  if (deployConfigured && publishMeta.lastDeploymentId) {
    try {
      const deployment = await fetchVercelDeployment(publishMeta.lastDeploymentId);
      if (deployment) {
        deployReadyState = deployment.readyState;
        const nextMeta: BbsPublishMeta = {
          ...publishMeta,
          lastDeployStatus: deployment.readyState,
        };

        if (deployment.readyState.toUpperCase() === 'READY') {
          // Stamp successful publish when the tracked deploy becomes ready.
          if (
            publishMeta.lastDeployStatus?.toUpperCase() !== 'READY' ||
            !publishMeta.lastPublishedAt
          ) {
            nextMeta.lastPublishedAt = new Date().toISOString();
          }
        }

        if (
          nextMeta.lastPublishedAt !== publishMeta.lastPublishedAt ||
          nextMeta.lastDeployStatus !== publishMeta.lastDeployStatus
        ) {
          await setBbsSiteContent({ publishMeta: nextMeta });
          publishMeta = nextMeta;
        }
      }
    } catch {
      deployConfigured = false;
    }
  }

  const contentState = getBbsContentPublishState({
    contentUpdatedAt,
    lastPublishedAt: publishMeta.lastPublishedAt,
  });
  const deployState = deployConfigured ? mapVercelDeployState(deployReadyState) : 'unavailable';
  const uiState: BbsPublishUiState = resolveBbsPublishUiState({
    contentState,
    deployState: deployState === 'unavailable' ? 'idle' : deployState,
  });

  return sendResponse(
    200,
    {
      status: uiState,
      tooltip: bbsPublishTooltip(uiState),
      contentState,
      deployState,
      deployConfigured,
      contentUpdatedAt: contentUpdatedAt ? new Date(contentUpdatedAt).toISOString() : null,
      publishMeta,
    },
    'Bold Brand Studio publish status fetched'
  );
};
