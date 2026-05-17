import { ProjectDetailHeroSkeleton } from '@/components/general/public-loading/ProjectDetailHeroSkeleton';
import { ProjectDetailContentSkeleton } from '@/components/general/public-loading/ProjectDetailContentSkeleton';
import { PublicContactCTASection } from '@/components/section/shared';

export function ProjectDetailPageLoadingContent() {
  return (
    <>
      <ProjectDetailHeroSkeleton />
      <ProjectDetailContentSkeleton />
      <PublicContactCTASection
        immediate
        title="Interested in a Similar Project?"
        description={
          <>
            Let&apos;s discuss how we can bring your vision to life with the same level of quality
            and attention to detail.
          </>
        }
        buttonLabel="Start Your Project"
      />
    </>
  );
}
