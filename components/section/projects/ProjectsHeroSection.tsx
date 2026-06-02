'use client';

import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';

type ProjectsHeroSectionProps = {
  immediate?: boolean;
};

export const ProjectsHeroSection = ({ immediate }: ProjectsHeroSectionProps = {}) => {
  return (
    <RegularPageHeroSection
      immediate={immediate}
      backgroundImage="/images/bg-hero-portfolio-new.jpg"
      badge="Portfolio"
      title="Our Projects"
      description="Explore our portfolio of successful projects that showcase our expertise and commitment to delivering exceptional results through structured creativity"
    />
  );
};
