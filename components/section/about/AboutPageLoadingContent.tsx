import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { GalleryGridSkeleton } from '@/components/general/public-loading/GalleryGridSkeleton';
import { TeamGridSkeleton } from '@/components/general/public-loading/TeamGridSkeleton';

export function AboutPageLoadingContent() {
  return (
    <>
      <HeroSection immediate />
      <StorySection immediate />
      <ValuesSection immediate />
      <GalleryGridSkeleton label="Loading work gallery" />
      <TeamGridSkeleton label="Loading team members" />
    </>
  );
}
