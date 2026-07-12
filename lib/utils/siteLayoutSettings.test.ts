import { describe, expect, it } from 'vitest';
import {
  buildBrandingCssVariables,
  buildEntityDetailMetadata,
  buildRootMetadataFromSettings,
  hexToHslChannels,
  resolveSiteFaviconUrl,
} from './siteLayoutSettings';

describe('hexToHslChannels', () => {
  it('converts Crelyst orange to HSL channels', () => {
    expect(hexToHslChannels('#F27B35')).toBe('22 88% 58%');
  });

  it('returns null for invalid hex', () => {
    expect(hexToHslChannels('not-a-color')).toBeNull();
  });
});

describe('buildRootMetadataFromSettings', () => {
  it('falls back to SEO_DETAILS when seo slice is missing fields', () => {
    const metadata = buildRootMetadataFromSettings(null);

    expect(metadata.description).toBe(
      'Crelyst is a full-service design and branding agency specializing in photography, brand design, product design, packaging, and visual identity. Where ideas take shape and colors speak.'
    );
    expect(metadata.title).toEqual({
      default: 'Crelyst - Creative Design Agency',
      template: '%s | Crelyst',
    });
  });

  it('uses Firestore seo values when present', () => {
    const metadata = buildRootMetadataFromSettings({
      metaTitleTemplate: '%s | Custom',
      metaDescription: 'Custom description',
      keywords: ['custom'],
      ogImageUrl: '/custom-og.png',
      faviconUrl: '/custom-favicon.png',
      canonicalUrlBase: 'https://example.com',
      robotsIndex: false,
      robotsFollow: true,
    });

    expect(metadata.description).toBe('Custom description');
    expect(metadata.title).toEqual({
      default: 'Crelyst - Creative Design Agency',
      template: '%s | Custom',
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});

describe('resolveSiteFaviconUrl', () => {
  it('prefers seo favicon, then branding, then static fallback', () => {
    expect(resolveSiteFaviconUrl({ faviconUrl: '/seo.ico' } as never, null)).toBe('/seo.ico');
    expect(resolveSiteFaviconUrl(null, { faviconUrl: '/brand.ico' } as never)).toBe('/brand.ico');
  });
});

describe('buildBrandingCssVariables', () => {
  it('maps brand hex colors to primary/secondary CSS variables', () => {
    expect(
      buildBrandingCssVariables({
        faviconUrl: '/favicon.png',
        primaryBrandColor: '#F27B35',
        secondaryBrandColor: '#404040',
      })
    ).toEqual({
      '--primary': '22 88% 58%',
      '--secondary': '0 0% 25%',
    });
  });
});

describe('buildEntityDetailMetadata', () => {
  it('prefers custom seo title and includes OG image from hero', () => {
    const metadata = buildEntityDetailMetadata(
      {
        title: 'Nextron',
        slug: 'nextron',
        heroImage: '/hero.png',
        seo: {
          metaTitle: 'Nextron | Brand Identity Case Study',
          metaDescription: 'Custom meta description',
        },
      },
      '/projects',
      'Our Projects'
    );

    expect(metadata.title).toEqual({ absolute: 'Nextron | Brand Identity Case Study' });
    expect(metadata.description).toBe('Custom meta description');
    expect(metadata.openGraph?.images).toEqual([{ url: expect.stringContaining('/hero.png') }]);
  });
});
