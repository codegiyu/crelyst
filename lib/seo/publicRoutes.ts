/** Public marketing routes included in sitemap and llms.txt (excludes admin, api, internal). */
export const PUBLIC_STATIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/gallery',
  '/work-with-us',
  '/contact',
] as const;

export type PublicStaticRoute = (typeof PUBLIC_STATIC_ROUTES)[number];
