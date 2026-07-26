import { listProjects, listServices } from '@/app/_server/lib/firestore/collections';
import { adminDb } from '@/lib/firebase/admin';
import { SEO_DETAILS } from '@/lib/constants/texts';
import { PUBLIC_STATIC_ROUTES } from '@/lib/seo/publicRoutes';
import { resolveSiteOrigin } from '@/lib/seo/siteOrigin';

type SlugRow = Record<string, unknown> & { slug?: unknown; title?: unknown };

async function loadDynamicRoutes(): Promise<string[]> {
  if (!adminDb) {
    return [];
  }

  try {
    const [{ items: projects }, { items: services }] = await Promise.all([
      listProjects({ isActive: true, limit: 500, page: 1 }),
      listServices({ isActive: true, limit: 500, page: 1 }),
    ]);

    const projectRoutes = (projects as SlugRow[])
      .filter(row => typeof row.slug === 'string')
      .map(row => `/projects/${row.slug as string}`);
    const serviceRoutes = (services as SlugRow[])
      .filter(row => typeof row.slug === 'string')
      .map(row => `/services/${row.slug as string}`);

    return [...projectRoutes, ...serviceRoutes];
  } catch {
    return [];
  }
}

export async function buildLlmsDocument(full = false): Promise<string> {
  const origin = resolveSiteOrigin();
  const staticRoutes = PUBLIC_STATIC_ROUTES.filter(path => path !== '/');
  const dynamicRoutes = await loadDynamicRoutes();
  const lines = [
    `# ${SEO_DETAILS.title.default}`,
    '',
    `> ${SEO_DETAILS.description}`,
    '',
    '## Canonical site',
    origin,
    '',
    '## Primary pages',
    ...[...staticRoutes, ...dynamicRoutes].map(path => `- ${origin}${path}`),
  ];

  if (full) {
    lines.push(
      '',
      '## Services offered',
      '- Brand identity and visual design',
      '- Product and packaging design',
      '- Photography and creative direction',
      '',
      '## Contact',
      `- ${origin}/contact`,
      '',
      'This file is generated from the same published route list as /sitemap.xml.'
    );
  }

  return `${lines.join('\n')}\n`;
}
