import { describe, expect, it } from 'vitest';
import { PUBLIC_STATIC_ROUTES } from './publicRoutes';
import { resolveSiteOrigin } from './siteOrigin';

describe('publicRoutes', () => {
  it('lists every major public marketing page', () => {
    expect(PUBLIC_STATIC_ROUTES).toEqual([
      '/',
      '/about',
      '/services',
      '/projects',
      '/gallery',
      '/work-with-us',
      '/contact',
    ]);
  });
});

describe('resolveSiteOrigin', () => {
  it('strips a trailing slash from the configured live URL', () => {
    expect(resolveSiteOrigin()).not.toMatch(/\/$/);
  });
});
