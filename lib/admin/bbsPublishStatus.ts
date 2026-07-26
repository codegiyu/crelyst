export type BbsContentPublishState = 'unpublished' | 'published' | 'unknown';

export type BbsVercelDeployState =
  | 'idle'
  | 'queued'
  | 'building'
  | 'ready'
  | 'error'
  | 'canceled'
  | 'unavailable';

export type BbsPublishUiState = 'unpublished' | 'building' | 'published' | 'error' | 'unknown';

export type BbsPublishMeta = {
  lastPublishedAt?: string | null;
  lastPublishTriggeredAt?: string | null;
  lastDeploymentId?: string | null;
  lastDeployStatus?: string | null;
};

export function toMillis(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value === 'object') {
    const asRecord = value as { toMillis?: () => number; seconds?: number; _seconds?: number };
    if (typeof asRecord.toMillis === 'function') {
      try {
        return asRecord.toMillis();
      } catch {
        return null;
      }
    }
    if (typeof asRecord.seconds === 'number') return asRecord.seconds * 1000;
    if (typeof asRecord._seconds === 'number') return asRecord._seconds * 1000;
  }
  return null;
}

export function getBbsContentPublishState(options: {
  contentUpdatedAt: unknown;
  lastPublishedAt: unknown;
}): BbsContentPublishState {
  const contentMs = toMillis(options.contentUpdatedAt);
  const publishedMs = toMillis(options.lastPublishedAt);

  if (contentMs == null) return 'unknown';
  if (publishedMs == null) return 'unpublished';
  if (contentMs > publishedMs) return 'unpublished';

  return 'published';
}

export function mapVercelDeployState(raw: string | null | undefined): BbsVercelDeployState {
  if (!raw) return 'idle';
  const normalized = raw.trim().toUpperCase();

  if (['QUEUED', 'INITIALIZING', 'PENDING'].includes(normalized)) return 'queued';
  if (['BUILDING', 'DEPLOYING'].includes(normalized)) return 'building';
  if (normalized === 'READY') return 'ready';
  if (['ERROR', 'FAILED'].includes(normalized)) return 'error';
  if (['CANCELED', 'CANCELLED'].includes(normalized)) return 'canceled';

  return 'unavailable';
}

export function resolveBbsPublishUiState(options: {
  contentState: BbsContentPublishState;
  deployState: BbsVercelDeployState;
}): BbsPublishUiState {
  if (options.deployState === 'queued' || options.deployState === 'building') {
    return 'building';
  }

  if (options.deployState === 'error' || options.deployState === 'canceled') {
    return 'error';
  }

  if (options.contentState === 'unpublished') return 'unpublished';
  if (options.contentState === 'published') return 'published';

  return 'unknown';
}

export function bbsPublishTooltip(state: BbsPublishUiState): string {
  switch (state) {
    case 'unpublished':
      return 'CMS has changes since the last successful Bold Brand Studio deploy.';
    case 'building':
      return 'Bold Brand Studio deploy in progress…';
    case 'published':
      return 'All saved changes are live on Bold Brand Studio.';
    case 'error':
      return 'Last deploy failed. Retry publish or check Vercel.';
    default:
      return 'Publish status is unavailable.';
  }
}
