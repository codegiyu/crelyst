'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { WorkWithUsHeroSection } from './WorkWithUsHeroSection';
import { WorkWithUsFormSection } from './WorkWithUsFormSection';

export const WorkWithUsPageClient = () => {
  return (
    <MainLayout>
      <WorkWithUsHeroSection />
      <WorkWithUsFormSection />
    </MainLayout>
  );
};
