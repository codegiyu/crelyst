import { PublicShell } from '@/components/layout/PublicShell';
import { PublicLoadErrorBanner } from '@/components/general/PublicLoadErrorBanner';
import { ProjectDetailHero } from '@/components/section/projects/ProjectDetailHero';
import { ProjectDetailContent } from '@/components/section/projects/ProjectDetailContent';
import { ProjectCaseStudyView } from '@/components/section/projects/ProjectCaseStudyView';
import { ProjectGallery } from '@/components/section/projects/ProjectGallery';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import { getCachedProjectBySlug } from '@/lib/ssr/cachedPublicDetail';
import { getAdjacentPublishedProjects } from '@/lib/ssr/adjacentPublishedProjects';
import { buildEntityDetailMetadata } from '@/lib/utils/siteLayoutSettings';
import { getSettingsSlice } from '@/app/_server/controllers/site/fetchSettings';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildCreativeWorkJsonLd } from '@/lib/seo/jsonLd';
import type { SEODetails } from '@/lib/types/site-settings';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, seoSlice] = await Promise.all([
    getCachedProjectBySlug(slug),
    getSettingsSlice('seo', false),
  ]);
  const project = data.ok ? data.data.project : undefined;
  const seo = (seoSlice as { seo?: SEODetails } | null)?.seo;

  if (project?.title) {
    return buildEntityDetailMetadata(project, '/projects', 'Our Projects', seo);
  }

  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return buildEntityDetailMetadata(
    { title, slug, description: `Discover the details of our ${title.toLowerCase()} project.` },
    '/projects',
    'Our Projects',
    seo
  );
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const data = await getCachedProjectBySlug(slug);
  if (!data.ok) {
    const footerResults = await Promise.all([
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
        '/api/site-settings/contactInfo'
      ),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
      serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>(
        '/api/site-settings/appDetails'
      ),
    ]);

    const footerSettings = {
      ...(footerResults[0].ok ? footerResults[0].data : {}),
      ...(footerResults[1].ok ? footerResults[1].data : {}),
      ...(footerResults[2].ok ? footerResults[2].data : {}),
    };

    return (
      <PublicShell transparentHeader footerSettings={footerSettings}>
        <PublicLoadErrorBanner />
      </PublicShell>
    );
  }

  const project = data.data.project;
  if (!project) {
    notFound();
  }

  const footerResults = await Promise.all([
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);

  const footerSettings = {
    ...(footerResults[0].ok ? footerResults[0].data : {}),
    ...(footerResults[1].ok ? footerResults[1].data : {}),
    ...(footerResults[2].ok ? footerResults[2].data : {}),
  };

  const adjacent = project.caseStudy ? await getAdjacentPublishedProjects(slug) : undefined;
  const image =
    project.heroImage || project.featuredImage || project.cardImage || project.bannerImage;
  const jsonLd = [
    buildCreativeWorkJsonLd({
      title: project.title,
      description: project.shortDescription || project.description,
      image,
      slug: project.slug,
      routePrefix: '/projects',
    }),
    buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: project.title, path: `/projects/${project.slug}` },
    ]),
  ];

  return (
    <PublicShell transparentHeader footerSettings={footerSettings}>
      <JsonLd data={jsonLd} />
      <ProjectDetailHero project={project} />
      {project.caseStudy ? <ProjectCaseStudyView project={project} adjacent={adjacent} /> : null}
      <ProjectDetailContent project={project} />
      {project.images && project.images.length > 0 ? <ProjectGallery project={project} /> : null}
    </PublicShell>
  );
}
