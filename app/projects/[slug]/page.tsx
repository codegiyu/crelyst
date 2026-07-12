import { PublicShell } from '@/components/layout/PublicShell';
import { ProjectDetailHero } from '@/components/section/projects/ProjectDetailHero';
import { ProjectDetailContent } from '@/components/section/projects/ProjectDetailContent';
import { ProjectCaseStudyView } from '@/components/section/projects/ProjectCaseStudyView';
import { ProjectGallery } from '@/components/section/projects/ProjectGallery';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import { getCachedProjectBySlug } from '@/lib/ssr/cachedPublicDetail';
import { getAdjacentPublishedProjects } from '@/lib/ssr/adjacentPublishedProjects';
import { buildEntityDetailMetadata } from '@/lib/utils/siteLayoutSettings';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedProjectBySlug(slug);
  const project = data?.project;

  if (project?.title) {
    return buildEntityDetailMetadata(project, '/projects', 'Our Projects');
  }

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return buildEntityDetailMetadata(
    { title, slug, description: `Discover the details of our ${title.toLowerCase()} project.` },
    '/projects',
    'Our Projects'
  );
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const data = await getCachedProjectBySlug(slug);
  const project = data?.project;
  if (!project) {
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

  const adjacent = project.caseStudy ? await getAdjacentPublishedProjects(slug) : undefined;

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <ProjectDetailHero project={project} />
      {project.caseStudy ? <ProjectCaseStudyView project={project} adjacent={adjacent} /> : null}
      <ProjectDetailContent project={project} />
      {!project.caseStudy && project.images && project.images.length > 0 ? (
        <ProjectGallery project={project} />
      ) : null}
    </PublicShell>
  );
}
