'use client';

import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';

type ServicesHeroSectionProps = {
  immediate?: boolean;
};

export const ServicesHeroSection = ({ immediate }: ServicesHeroSectionProps = {}) => {
  return (
    <RegularPageHeroSection
      immediate={immediate}
      backgroundImage="/images/bg-hero-services-new.jpg"
      badge="What We Offer"
      title="Our Creative Services"
      description="Merging technical sophistication with cinematic vision to craft brands and products that define the next generation of creative industry"
    />
  );
};
