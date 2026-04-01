import { PublicShell } from '@/components/layout/PublicShell';
import { WorkWithUsPageView } from '@/components/section/work-with-us/WorkWithUsPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work With Us',
  description:
    'Join our creative network. We collaborate with talented freelance designers on select projects, sharing a percentage of each job.',
};

export default async function WorkWithUsPage() {
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
      <WorkWithUsPageView />
    </PublicShell>
  );
}
