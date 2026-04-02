/** JSON API + HTML dynamic responses: avoid stale admin-driven content behind browsers/CDNs. */
export const JSON_NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
} as const;
