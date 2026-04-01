import { PublicShell } from '@/components/layout/PublicShell';
import { ProjectsPageView } from '@/components/section/projects/ProjectsPageView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { IProjectsListRes, ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects',
  description:
    'Explore our portfolio of creative work — branding, packaging, photography, and digital experiences that help brands stand out.',
};

export default async function ProjectsPage() {
  const [projectsRes, contactInfoSlice, socialsSlice, appDetailsSlice] = await Promise.all([
    serverFetchJsonOrNull<IProjectsListRes>('/api/projects?limit=100'),
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
      <ProjectsPageView projects={projectsRes?.projects ?? []} />
    </PublicShell>
  );
}
