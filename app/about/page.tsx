import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { AboutPageView } from '@/components/section/about/AboutPageView';
import { hasAnyServerFetchFailure, serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings, ITeamMembersListRes } from '@/lib/constants/endpoints';
import { DEFAULT_ABOUT_PAGE_CONTENT } from '@/lib/types/about-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Crelyst, our creative design philosophy, and how we help brands express their unique personality through powerful visuals and storytelling.',
};

export default async function AboutPage() {
  const fetchResults = await Promise.all([
    serverFetchJsonOrNull<ITeamMembersListRes>('/api/team-members?limit=100'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'aboutPage'>>('/api/site-settings/aboutPage'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const [teamRes, aboutPageSlice, contactInfoSlice, socialsSlice, appDetailsSlice] = fetchResults;

  // Missing aboutPage slice is expected before first CMS save — do not treat as page failure
  const loadFailed = hasAnyServerFetchFailure([
    teamRes,
    contactInfoSlice,
    socialsSlice,
    appDetailsSlice,
  ]);

  const footerSettings = {
    ...(contactInfoSlice.ok ? contactInfoSlice.data : {}),
    ...(socialsSlice.ok ? socialsSlice.data : {}),
    ...(appDetailsSlice.ok ? appDetailsSlice.data : {}),
  };

  const aboutPage =
    aboutPageSlice.ok && aboutPageSlice.data.aboutPage
      ? aboutPageSlice.data.aboutPage
      : DEFAULT_ABOUT_PAGE_CONTENT;

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      {loadFailed ? <PublicLoadErrorBanner /> : null}
      <AboutPageView
        teamMembers={teamRes.ok ? (teamRes.data.teamMembers ?? []) : []}
        aboutPage={aboutPage}
      />
    </PublicShell>
  );
}
