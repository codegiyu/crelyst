import type { MetadataRoute } from 'next';
import { listProjects, listServices } from '@/app/_server/lib/firestore/collections';
import { adminDb } from '@/lib/firebase/admin';
import { PUBLIC_STATIC_ROUTES } from '@/lib/seo/publicRoutes';
import { resolveSiteOrigin } from '@/lib/seo/siteOrigin';

export const dynamic = 'force-dynamic';

type SlugRow = Record<string, unknown> & { slug?: unknown };

function toSlugEntries(
  rows: SlugRow[],
  pathPrefix: '/projects' | '/services',
  origin: string,
  lastModified: Date
): MetadataRoute.Sitemap {
  return rows
    .filter(row => typeof row.slug === 'string' && row.slug.length > 0)
    .map(row => ({
      url: `${origin}${pathPrefix}/${row.slug as string}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = resolveSiteOrigin();
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_STATIC_ROUTES.map(path => ({
    url: path === '/' ? origin : `${origin}${path}`,
    lastModified,
    changeFrequency: path === '/' ? ('weekly' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : 0.7,
  }));

  if (!adminDb) {
    return staticEntries;
  }

  try {
    const [{ items: projects }, { items: services }] = await Promise.all([
      listProjects({ isActive: true, limit: 500, page: 1 }),
      listServices({ isActive: true, limit: 500, page: 1 }),
    ]);

    return [
      ...staticEntries,
      ...toSlugEntries(projects as SlugRow[], '/projects', origin, lastModified),
      ...toSlugEntries(services as SlugRow[], '/services', origin, lastModified),
    ];
  } catch {
    return staticEntries;
  }
}
