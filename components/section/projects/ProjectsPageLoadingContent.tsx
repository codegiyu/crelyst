import { ProjectsHeroSection } from './ProjectsHeroSection';
import { PublicCardGridSkeleton } from '@/components/general/public-loading/PublicCardGridSkeleton';

export function ProjectsPageLoadingContent() {
  return (
    <>
      <ProjectsHeroSection immediate />
      <PublicCardGridSkeleton label="Loading projects" />
    </>
  );
}
