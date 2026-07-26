import { ENVIRONMENT } from '@/lib/config/environment';

export type VercelDeploymentInfo = {
  id: string;
  readyState: string;
  url?: string;
  createdAt?: number;
};

function vercelHeaders(): HeadersInit {
  const token = ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_TOKEN;
  if (!token) {
    throw new Error('Bold Brand Studio Vercel token is not configured');
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };
}

function teamQuery(): string {
  const teamId = ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_TEAM_ID;
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
}

export function isVercelDeployStatusConfigured(): boolean {
  return Boolean(
    ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_TOKEN && ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_PROJECT_ID
  );
}

export async function fetchVercelDeployment(
  deploymentId: string
): Promise<VercelDeploymentInfo | null> {
  if (!isVercelDeployStatusConfigured()) return null;

  const response = await fetch(
    `https://api.vercel.com/v13/deployments/${encodeURIComponent(deploymentId)}${teamQuery()}`,
    { headers: vercelHeaders(), method: 'GET' }
  );

  if (!response.ok) {
    throw new Error(`Vercel deployment lookup failed (${response.status})`);
  }

  const json = (await response.json()) as {
    id?: string;
    uid?: string;
    readyState?: string;
    status?: string;
    url?: string;
    createdAt?: number;
  };

  const id = json.id || json.uid;
  const readyState = json.readyState || json.status;
  if (!id || !readyState) return null;

  return {
    id,
    readyState,
    url: json.url,
    createdAt: json.createdAt,
  };
}

export async function fetchLatestVercelDeploymentSince(
  sinceMs: number
): Promise<VercelDeploymentInfo | null> {
  if (!isVercelDeployStatusConfigured()) return null;

  const projectId = ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_PROJECT_ID!;
  const query = new URLSearchParams({
    projectId,
    limit: '5',
  });
  const teamId = ENVIRONMENT.BOLD_BRAND_STUDIO.VERCEL_TEAM_ID;
  if (teamId) query.set('teamId', teamId);

  const response = await fetch(`https://api.vercel.com/v6/deployments?${query.toString()}`, {
    headers: vercelHeaders(),
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Vercel deployments list failed (${response.status})`);
  }

  const json = (await response.json()) as {
    deployments?: Array<{
      uid?: string;
      id?: string;
      readyState?: string;
      state?: string;
      url?: string;
      created?: number;
      createdAt?: number;
    }>;
  };

  const deployments = json.deployments ?? [];
  const match = deployments.find(item => {
    const created = item.createdAt ?? item.created ?? 0;
    return created >= sinceMs - 5_000;
  });

  if (!match) return null;

  const id = match.uid || match.id;
  const readyState = match.readyState || match.state;
  if (!id || !readyState) return null;

  return {
    id,
    readyState,
    url: match.url,
    createdAt: match.createdAt ?? match.created,
  };
}

export function extractDeploymentIdFromHookPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  const job = record.job as Record<string, unknown> | undefined;
  const candidates = [record.id, record.deploymentId, job?.id, job?.deploymentId];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }

  return null;
}
