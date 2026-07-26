import type { ClientService } from '@/lib/constants/endpoints';
import type { ContactInfo, SEODetails, Social } from '@/lib/types/site-settings';
import { SEO_DETAILS } from '@/lib/constants/texts';
import { resolveSiteOrigin } from '@/lib/seo/siteOrigin';

type JsonLd = Record<string, unknown>;

function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) => entry !== undefined && entry !== null && entry !== ''
    )
  ) as T;
}

export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data);
}

export function buildOrganizationJsonLd(input: {
  seo?: SEODetails | null;
  contactInfo?: ContactInfo | null;
  socials?: Social[] | null;
  origin?: string;
}): JsonLd {
  const origin = input.origin ?? resolveSiteOrigin();
  const name = SEO_DETAILS.title.default;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: origin,
    logo: input.seo?.ogImageUrl || SEO_DETAILS.image,
    description: input.seo?.metaDescription || SEO_DETAILS.description,
    email: input.contactInfo?.email?.[0],
    telephone: input.contactInfo?.tel?.[0],
    address: input.contactInfo?.address?.[0],
    sameAs: input.socials
      ?.map(social => social.href?.trim())
      .filter((href): href is string => Boolean(href)),
  });
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
  origin?: string
): JsonLd {
  const base = origin ?? resolveSiteOrigin();

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path === '/' ? base : `${base}${item.path}`,
    })),
  };
}

export function buildCreativeWorkJsonLd(input: {
  title: string;
  description?: string;
  image?: string;
  slug: string;
  routePrefix: '/projects' | '/services';
  creatorName?: string;
  origin?: string;
}): JsonLd {
  const origin = input.origin ?? resolveSiteOrigin();
  const url = `${origin}${input.routePrefix}/${input.slug}`;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.title,
    description: input.description,
    image: input.image,
    url,
    creator: input.creatorName
      ? {
          '@type': 'Organization',
          name: input.creatorName,
        }
      : undefined,
    about: input.title,
  });
}

export function buildServiceJsonLd(service: ClientService, origin?: string): JsonLd {
  const base = origin ?? resolveSiteOrigin();
  const url = `${base}/services/${service.slug}`;
  const offers = service.packagePricing
    ?.flatMap(category =>
      category.packages.map(pkg => {
        const min = pkg.priceRange?.[0];
        const max = pkg.priceRange?.[1];
        if (min == null) return null;

        return compact({
          '@type': 'Offer',
          name: pkg.title?.trim() || pkg.id || category.id,
          priceCurrency: 'NGN',
          price: min,
          ...(max != null && max !== min ? { highPrice: max } : {}),
          url,
          availability: 'https://schema.org/InStock',
        });
      })
    )
    .filter(Boolean);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.pageTitle || service.title,
    description: service.shortDescription || service.description,
    image: service.bannerImage || service.cardImage || service.image,
    url,
    provider: {
      '@type': 'Organization',
      name: SEO_DETAILS.title.default,
      url: base,
    },
    ...(offers?.length ? { offers } : {}),
  });
}

export function buildFaqPageJsonLd(
  faq: Array<{ question: string; answer: string }> | undefined,
  _origin?: string
): JsonLd | null {
  if (!faq?.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq
      .filter(item => item.question?.trim() && item.answer?.trim())
      .map(item => ({
        '@type': 'Question',
        name: item.question.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.trim(),
        },
      })),
  };
}
