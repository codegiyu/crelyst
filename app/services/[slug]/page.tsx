import { PublicShell } from '@/components/layout/PublicShell';
import { ServiceDetailHero } from '@/components/section/services/ServiceDetailHero';
import { ServiceDetailContent } from '@/components/section/services/ServiceDetailContent';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import { getCachedServiceBySlug } from '@/lib/ssr/cachedPublicDetail';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedServiceBySlug(slug);
  const service = data?.service;
  if (service?.title) {
    return {
      title: `${service.title} | Our Services`,
      description:
        service.shortDescription ||
        service.description ||
        `Learn more about our ${service.title} services.`,
    };
  }
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    title: `${title} | Our Services`,
    description: `Learn more about our ${title.toLowerCase()} services and how we can help your business succeed.`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const data = await getCachedServiceBySlug(slug);
  const service = data?.service;
  if (!service) {
    notFound();
  }

  const [contactInfoSlice, socialsSlice, appDetailsSlice] = await Promise.all([
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const footerSettings = {
    ...contactInfoSlice,
    ...socialsSlice,
    ...appDetailsSlice,
  };

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <ServiceDetailHero service={service} />
      <ServiceDetailContent service={service} />
    </PublicShell>
  );
}
