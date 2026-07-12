import type { Metadata } from 'next';
import { omit } from 'lodash';
import type { Branding, SEODetails } from '@/lib/types/site-settings';
import { SEO_DETAILS } from '@/lib/constants/texts';
import { ENVIRONMENT } from '@/lib/config/environment';

/** Convert #RRGGBB to space-separated HSL components for `hsl(var(--primary))` tokens. */
export function hexToHslChannels(hex: string): string | null {
  const normalized = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  switch (max) {
    case r:
      hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      hue = ((b - r) / delta + 2) * 60;
      break;
    default:
      hue = ((r - g) / delta + 4) * 60;
  }

  return `${Math.round(hue)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

function resolveMetadataBase(seo?: SEODetails | null): URL {
  const base =
    seo?.canonicalUrlBase?.trim() ||
    ENVIRONMENT.SEO.LIVE_URL ||
    SEO_DETAILS.metadataBase.toString();
  try {
    return new URL(base);
  } catch {
    return SEO_DETAILS.metadataBase;
  }
}

function resolveAbsoluteAssetUrl(url: string | undefined, metadataBase: URL): string | undefined {
  if (!url?.trim()) return undefined;

  try {
    return new URL(url, metadataBase).toString();
  } catch {
    return url;
  }
}

export function resolveSiteFaviconUrl(seo?: SEODetails | null, branding?: Branding | null): string {
  return (
    seo?.faviconUrl?.trim() || branding?.faviconUrl?.trim() || SEO_DETAILS.icons || '/favicon.ico'
  );
}

export function buildBrandingCssVariables(branding?: Branding | null): Record<string, string> {
  const variables: Record<string, string> = {};
  const primary = branding?.primaryBrandColor ? hexToHslChannels(branding.primaryBrandColor) : null;
  const secondary = branding?.secondaryBrandColor
    ? hexToHslChannels(branding.secondaryBrandColor)
    : null;

  if (primary) variables['--primary'] = primary;
  if (secondary) variables['--secondary'] = secondary;

  return variables;
}

export function buildRootMetadataFromSettings(seo?: SEODetails | null): Metadata {
  const metadataBase = resolveMetadataBase(seo);
  const titleDefault = SEO_DETAILS.title.default;
  const titleTemplate = seo?.metaTitleTemplate?.trim() || SEO_DETAILS.title.template;
  const description = seo?.metaDescription?.trim() || SEO_DETAILS.description;
  const ogDescription = seo?.metaDescription?.trim() || SEO_DETAILS.ogDesc;
  const keywords = seo?.keywords?.length ? seo.keywords : SEO_DETAILS.keywords;
  const ogImage = resolveAbsoluteAssetUrl(seo?.ogImageUrl, metadataBase) || SEO_DETAILS.image;
  const canonical =
    seo?.canonicalUrlBase?.trim() || SEO_DETAILS.alternates.canonical || metadataBase.toString();
  const robotsIndex = seo?.robotsIndex ?? SEO_DETAILS.robots.index;
  const robotsFollow = seo?.robotsFollow ?? SEO_DETAILS.robots.follow;

  return {
    ...omit(SEO_DETAILS, [
      'image',
      'ogDesc',
      'title',
      'description',
      'alternates',
      'robots',
      'keywords',
    ]),
    metadataBase,
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description,
    keywords,
    alternates: {
      canonical,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      nocache: SEO_DETAILS.robots.nocache,
      googleBot: SEO_DETAILS.robots.googleBot,
    },
    openGraph: {
      title: titleDefault,
      description: ogDescription,
      type: 'website',
      url: metadataBase.toString(),
      siteName: titleDefault,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      images: ogImage,
    },
  };
}

export type EntitySeoFields = {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalPath?: string;
    openGraph?: {
      image?: string;
      images?: string[];
    };
  };
  heroImage?: string;
  featuredImage?: string;
  bannerImage?: string;
  cardImage?: string;
};

export function buildEntityDetailMetadata(
  entity: EntitySeoFields,
  routePrefix: '/projects' | '/services',
  pageLabel: string,
  seo?: SEODetails | null
): Metadata {
  const metadataBase = resolveMetadataBase(seo);
  const title = entity.seo?.metaTitle?.trim()
    ? { absolute: entity.seo.metaTitle.trim() }
    : `${entity.title} | ${pageLabel}`;
  const description =
    entity.seo?.metaDescription?.trim() ||
    entity.shortDescription?.trim() ||
    entity.description?.trim() ||
    `Discover ${entity.title}.`;
  const keywords = entity.seo?.keywords;
  const entityImage =
    entity.seo?.openGraph?.images?.[0] ||
    entity.seo?.openGraph?.image ||
    entity.heroImage ||
    entity.featuredImage ||
    entity.bannerImage ||
    entity.cardImage;
  const siteDefaultOg = resolveAbsoluteAssetUrl(seo?.ogImageUrl, metadataBase) || SEO_DETAILS.image;
  const ogImage = entityImage
    ? (resolveAbsoluteAssetUrl(entityImage, metadataBase) ?? siteDefaultOg)
    : siteDefaultOg;
  const canonicalPath = entity.seo?.canonicalPath?.trim() || `${routePrefix}/${entity.slug}`;
  const canonical = resolveAbsoluteAssetUrl(canonicalPath, metadataBase) ?? canonicalPath;
  const resolvedTitle = typeof title === 'object' ? title.absolute : title;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      images: [{ url: ogImage }],
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: resolvedTitle,
      description,
      images: ogImage,
    },
  };
}
