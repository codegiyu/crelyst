import { PublicShell } from '@/components/layout/PublicShell';
import { AboutPageView } from '@/components/section/about/AboutPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings, ITeamMembersListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Crelyst, our creative design philosophy, and how we help brands express their unique personality through powerful visuals and storytelling.',
};

export default async function AboutPage() {
  const [teamRes, contactInfoSlice, socialsSlice, appDetailsSlice] = await Promise.all([
    serverFetchJsonOrNull<ITeamMembersListRes>('/api/team-members?limit=100'),
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
      <AboutPageView teamMembers={teamRes?.teamMembers ?? []} />
    </PublicShell>
  );
}
