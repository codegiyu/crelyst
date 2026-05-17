import { ServiceDetailHeroSkeleton } from '@/components/general/public-loading/ServiceDetailHeroSkeleton';
import { ServiceDetailContentSkeleton } from '@/components/general/public-loading/ServiceDetailContentSkeleton';
import { PublicContactCTASection } from '@/components/section/shared';

export function ServiceDetailPageLoadingContent() {
  return (
    <>
      <ServiceDetailHeroSkeleton />
      <ServiceDetailContentSkeleton />
      <PublicContactCTASection
        immediate
        title="Ready to Get Started?"
        description={
          <>
            Let&apos;s discuss how we can help you achieve your goals with our creative solutions.
          </>
        }
        buttonLabel="Contact Us Today"
      />
    </>
  );
}
