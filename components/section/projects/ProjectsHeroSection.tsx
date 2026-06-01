'use client';

import { PageHeroSection } from '@/components/general/PageHeroSection';

type ProjectsHeroSectionProps = {
  immediate?: boolean;
};

export const ProjectsHeroSection = ({ immediate }: ProjectsHeroSectionProps = {}) => {
  return (
    <PageHeroSection
      immediate={immediate}
      bannerImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1920&auto=format&fit=crop"
      badge="Our Portfolio"
      title="Our Projects"
      description="Explore our portfolio of successful projects that showcase our expertise and commitment to delivering exceptional results."
      titleFont="heading"
      gradientColors={{
        from: 'from-accent/5',
        via: 'via-background',
        to: 'to-primary/5',
      }}
    />
  );
};
