import type { MetadataRoute } from 'next';
import { resolveSiteOrigin } from '@/lib/seo/siteOrigin';

export default function robots(): MetadataRoute.Robots {
  const origin = resolveSiteOrigin();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
