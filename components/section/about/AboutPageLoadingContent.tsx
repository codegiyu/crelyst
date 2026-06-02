import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { TeamGridSkeleton } from '@/components/general/public-loading/TeamGridSkeleton';

export function AboutPageLoadingContent() {
  return (
    <>
      <HeroSection immediate />
      <StorySection immediate />
      <ValuesSection immediate />
      <TeamGridSkeleton label="Loading team members" />
    </>
  );
}
