import { ServicesHeroSection } from './ServicesHeroSection';
import { PublicCardGridSkeleton } from '@/components/general/public-loading/PublicCardGridSkeleton';

export function ServicesPageLoadingContent() {
  return (
    <>
      <ServicesHeroSection immediate />
      <PublicCardGridSkeleton label="Loading services" />
    </>
  );
}
