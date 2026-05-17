import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { ProjectsPageLoadingContent } from '@/components/section/projects/ProjectsPageLoadingContent';

export default async function ProjectsLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <ProjectsPageLoadingContent />
    </PublicPageLoading>
  );
}
