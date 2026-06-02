'use client';

import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { useGalleryScrollSnap } from '@/lib/hooks/useGalleryScrollSnap';
import { GalleryDomeSection } from './GalleryDomeSection';
import { GalleryHeroSection } from './GalleryHeroSection';

export type GalleryPageViewProps = {
  images: string[];
};

export const GalleryPageView = ({ images }: GalleryPageViewProps) => {
  useGalleryScrollSnap();

  return (
    <>
      <div className="snap-start">
        <GalleryHeroSection />
      </div>
      <GalleryDomeSection images={images} />
      <PublicContactCTASection
        caption="Start a project"
        title="See something you love?"
        description="Tell us about your brand, product, or campaign — we'll help you bring it to life with the same craft on display here."
        buttonLabel="Start Your Project"
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
