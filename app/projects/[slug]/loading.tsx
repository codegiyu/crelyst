import { PublicPageLoading } from '@/components/layout/PublicPageLoading';
import { ProjectDetailPageLoadingContent } from '@/components/section/projects/ProjectDetailPageLoadingContent';

export default async function ProjectDetailLoading() {
  return (
    <PublicPageLoading transparentHeader>
      <ProjectDetailPageLoadingContent />
    </PublicPageLoading>
  );
}
