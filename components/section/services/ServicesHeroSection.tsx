'use client';

import { PageHeroSection } from '@/components/general/PageHeroSection';

type ServicesHeroSectionProps = {
  immediate?: boolean;
};

export const ServicesHeroSection = ({ immediate }: ServicesHeroSectionProps = {}) => {
  return (
    <PageHeroSection
      immediate={immediate}
      bannerImage="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1920&auto=format&fit=crop"
      badge="What We Offer"
      title="Our Creative Services"
      description="From photography to packaging, we offer a full range of design and branding services to help your brand express its unique personality through powerful visuals and storytelling."
      titleFont="heading"
    />
  );
};
