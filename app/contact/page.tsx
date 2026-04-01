import { PublicShell } from '@/components/layout/PublicShell';
import { ContactPageView } from '@/components/section/contact/ContactPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    "Get a customized quote for your design project. Tell us about your needs and we'll provide a tailored proposal.",
};

export default async function ContactPage() {
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
      <ContactPageView contactInfo={footerSettings.contactInfo} socials={footerSettings.socials} />
    </PublicShell>
  );
}
