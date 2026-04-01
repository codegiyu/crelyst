import { cache } from 'react';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientProject, ClientService } from '@/lib/constants/endpoints';

export const getCachedProjectBySlug = cache((slug: string) =>
  serverFetchJsonOrNull<{ project: ClientProject }>(`/api/projects/${encodeURIComponent(slug)}`)
);

export const getCachedServiceBySlug = cache((slug: string) =>
  serverFetchJsonOrNull<{ service: ClientService }>(`/api/services/${encodeURIComponent(slug)}`)
);
