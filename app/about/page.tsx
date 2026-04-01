import { PublicShell } from '@/components/layout/PublicShell';
import { AboutPageView } from '@/components/section/about/AboutPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type {
  ClientSiteSettings,
  IProjectsListRes,
  IServicesListRes,
  ITeamMembersListRes,
} from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Crelyst, our creative design philosophy, and how we help brands express their unique personality through powerful visuals and storytelling.',
};

export default async function AboutPage() {
  const [teamRes, projectsRes, servicesRes, contactInfoSlice, socialsSlice, appDetailsSlice] =
    await Promise.all([
      serverFetchJsonOrNull<ITeamMembersListRes>('/api/team-members?limit=100'),
      serverFetchJsonOrNull<IProjectsListRes>('/api/projects?limit=100'),
      serverFetchJsonOrNull<IServicesListRes>('/api/services?limit=100'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
        '/api/site-settings/contactInfo'
      ),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>(
        '/api/site-settings/appDetails'
      ),
    ]);

  const footerSettings = {
    ...contactInfoSlice,
    ...socialsSlice,
    ...appDetailsSlice,
  };

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <AboutPageView
        teamMembers={teamRes?.teamMembers ?? []}
        projects={projectsRes?.projects ?? []}
        services={servicesRes?.services ?? []}
      />
    </PublicShell>
  );
}
