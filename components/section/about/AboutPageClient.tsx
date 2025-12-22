'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { TeamSection } from './TeamSection';
import { ValuesSection } from './ValuesSection';
import { GallerySection } from './GallerySection';

export const AboutPageClient = () => {
  return (
    <MainLayout transparentHeader>
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <GallerySection />
      <TeamSection />
    </MainLayout>
  );
};
