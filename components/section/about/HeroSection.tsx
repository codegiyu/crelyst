'use client';

import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';

type HeroSectionProps = {
  immediate?: boolean;
};

export const HeroSection = ({ immediate }: HeroSectionProps = {}) => {
  return (
    <RegularPageHeroSection
      immediate={immediate}
      backgroundImage="/images/bg-hero-3.jpg"
      badge="About Us"
      title={
        <>
          Where Creativity Meets
          <br />
          Vision
        </>
      }
      description="We're a creative design agency specializing in photography, branding, product design, packaging, and visual identity. We help brands express their unique personality through powerful visuals and storytelling."
    />
  );
};
