import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { ProjectsPageView } from '@/components/section/projects/ProjectsPageView';
import { hasAnyServerFetchFailure, serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { IProjectsListRes, ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects',
  description:
    'Explore our portfolio of creative work — branding, packaging, photography, and digital experiences that help brands stand out.',
};

export default async function ProjectsPage() {
  const fetchResults = await Promise.all([
    serverFetchJsonOrNull<IProjectsListRes>('/api/projects?limit=100'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const [projectsRes, contactInfoSlice, socialsSlice, appDetailsSlice] = fetchResults;
  const loadFailed = hasAnyServerFetchFailure(fetchResults);

  const footerSettings = {
    ...(contactInfoSlice.ok ? contactInfoSlice.data : {}),
    ...(socialsSlice.ok ? socialsSlice.data : {}),
    ...(appDetailsSlice.ok ? appDetailsSlice.data : {}),
  };

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      {loadFailed ? <PublicLoadErrorBanner /> : null}
      <ProjectsPageView projects={projectsRes.ok ? (projectsRes.data.projects ?? []) : []} />
    </PublicShell>
  );
}
