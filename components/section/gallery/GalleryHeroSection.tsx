'use client';

import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';

export const GalleryHeroSection = () => {
  return (
    <RegularPageHeroSection
      backgroundImage="/images/bg-hero-gallery.jpg"
      badge="Visual Showcase"
      title="The Crelyst Gallery"
      description="Drag through our work in the round — photography, branding, and design from the studio floor to the final frame."
    />
  );
};
