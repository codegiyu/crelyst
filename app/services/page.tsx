import { PublicShell } from '@/components/layout/PublicShell';
import { ServicesPageView } from '@/components/section/services/ServicesPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { IServicesListRes, ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'From photography to packaging, explore our full range of creative design and branding services to help your brand express its unique personality.',
};

export default async function ServicesPage() {
  const [servicesRes, contactInfoSlice, socialsSlice, appDetailsSlice] = await Promise.all([
    serverFetchJsonOrNull<IServicesListRes>('/api/services?limit=100'),
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
      <ServicesPageView services={servicesRes?.services ?? []} />
    </PublicShell>
  );
}
