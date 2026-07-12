import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { ContactPageView } from '@/components/section/contact/ContactPageView';
import { hasAnyServerFetchFailure, serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    "Get a customized quote for your design project. Tell us about your needs and we'll provide a tailored proposal.",
};

export default async function ContactPage() {
  const fetchResults = await Promise.all([
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const [contactInfoSlice, socialsSlice, appDetailsSlice] = fetchResults;
  const loadFailed = hasAnyServerFetchFailure(fetchResults);

  const footerSettings = {
    ...(contactInfoSlice.ok ? contactInfoSlice.data : {}),
    ...(socialsSlice.ok ? socialsSlice.data : {}),
    ...(appDetailsSlice.ok ? appDetailsSlice.data : {}),
  };

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      {loadFailed ? <PublicLoadErrorBanner /> : null}
      <ContactPageView contactInfo={footerSettings.contactInfo} socials={footerSettings.socials} />
    </PublicShell>
  );
}
