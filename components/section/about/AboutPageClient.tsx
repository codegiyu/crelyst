'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { TeamSection } from './TeamSection';
import { ValuesSection } from './ValuesSection';

export const AboutPageClient = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
    </MainLayout>
  );
};
