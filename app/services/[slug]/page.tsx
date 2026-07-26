import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { ServiceDetailHero } from '@/components/section/services/ServiceDetailHero';
import { ServiceDetailContent } from '@/components/section/services/ServiceDetailContent';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import { getCachedServiceBySlug } from '@/lib/ssr/cachedPublicDetail';
import { buildEntityDetailMetadata } from '@/lib/utils/siteLayoutSettings';
import { getSettingsSlice } from '@/app/_server/controllers/site/fetchSettings';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd, buildServiceJsonLd } from '@/lib/seo/jsonLd';
import type { SEODetails } from '@/lib/types/site-settings';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, seoSlice] = await Promise.all([
    getCachedServiceBySlug(slug),
    getSettingsSlice('seo', false),
  ]);
  const service = data.ok ? data.data.service : undefined;
  const seo = (seoSlice as { seo?: SEODetails } | null)?.seo;

  if (service?.title) {
    return buildEntityDetailMetadata(service, '/services', 'Our Services', seo);
  }

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return buildEntityDetailMetadata(
    { title, slug, description: `Learn more about our ${title.toLowerCase()} services.` },
    '/services',
    'Our Services',
    seo
  );
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const data = await getCachedServiceBySlug(slug);

  if (!data.ok) {
    const footerResults = await Promise.all([
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
        '/api/site-settings/contactInfo'
      ),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>(
        '/api/site-settings/appDetails'
      ),
    ]);

    const footerSettings = {
      ...(footerResults[0].ok ? footerResults[0].data : {}),
      ...(footerResults[1].ok ? footerResults[1].data : {}),
      ...(footerResults[2].ok ? footerResults[2].data : {}),
    };

    return (
      <PublicShell transparentHeader footerSettings={footerSettings}>
        <PublicLoadErrorBanner />
      </PublicShell>
    );
  }

  const service = data.data.service;
  if (!service) {
    notFound();
  }

  const footerResults = await Promise.all([
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const footerSettings = {
    ...(footerResults[0].ok ? footerResults[0].data : {}),
    ...(footerResults[1].ok ? footerResults[1].data : {}),
    ...(footerResults[2].ok ? footerResults[2].data : {}),
  };

  const jsonLd = [
    buildServiceJsonLd(service),
    buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.pageTitle || service.title, path: `/services/${service.slug}` },
    ]),
    buildFaqPageJsonLd(service.faq),
  ].filter((entry): entry is Record<string, unknown> => Boolean(entry));

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <JsonLd data={jsonLd} />
      <ServiceDetailHero service={service} />
      <ServiceDetailContent service={service} />
    </PublicShell>
  );
}
