'use client';

import { HeroSection } from './HeroSection';
import { ServicesPreviewSection } from './ServicesPreviewSection';
import { AboutPreviewSection } from './AboutPreviewSection';
import { ProjectsPreviewSection } from './ProjectsPreviewSection';
import { TestimonialsSection } from './TestimonialsSection';
import { BrandsSection } from './BrandsSection';
import { CTASection } from './CTASection';
import type {
  ClientBrand,
  ClientProject,
  ClientService,
  ClientSiteSettings,
  ClientTestimonial,
} from '@/lib/constants/endpoints';

export type HomePageViewProps = {
  services: ClientService[];
  projects: ClientProject[];
  testimonials: ClientTestimonial[];
  brands: ClientBrand[];
  contactInfo?: ClientSiteSettings['contactInfo'];
};

export const HomePageView = ({
  services,
  projects,
  testimonials,
  brands,
  contactInfo,
}: HomePageViewProps) => {
  return (
    <>
      <HeroSection />
      <BrandsSection brands={brands} />
      <ServicesPreviewSection services={services} />
      <AboutPreviewSection />
      <ProjectsPreviewSection projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection contactInfo={contactInfo} projects={projects} services={services} />
    </>
  );
};
