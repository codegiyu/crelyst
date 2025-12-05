/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from './HeroSection';
import { ServicesPreviewSection } from './ServicesPreviewSection';
import { AboutPreviewSection } from './AboutPreviewSection';
import { ProjectsPreviewSection } from './ProjectsPreviewSection';
import { TestimonialsSection } from './TestimonialsSection';
import { BrandsSection } from './BrandsSection';
import { CTASection } from './CTASection';
import { useServicesStore } from '@/lib/store/useServicesStore';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';
import { useBrandsStore } from '@/lib/store/useBrandsStore';

export const HomePageClient = () => {
  const { fetchServices } = useServicesStore(state => state.actions);
  const { fetchProjects } = useProjectsStore(state => state.actions);
  const { fetchTestimonials } = useTestimonialsStore(state => state.actions);
  const { fetchBrands } = useBrandsStore(state => state.actions);

  useEffect(() => {
    // Fetch all data for the homepage
    fetchServices();
    fetchProjects();
    fetchTestimonials();
    fetchBrands();
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <BrandsSection />
      <ServicesPreviewSection />
      <AboutPreviewSection />
      <ProjectsPreviewSection />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  );
};
