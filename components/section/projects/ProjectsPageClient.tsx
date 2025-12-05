/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectsHeroSection } from './ProjectsHeroSection';
import { ProjectsGridSection } from './ProjectsGridSection';
import { useProjectsStore } from '@/lib/store/useProjectsStore';

export const ProjectsPageClient = () => {
  const { fetchProjects } = useProjectsStore(state => state.actions);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <MainLayout>
      <ProjectsHeroSection />
      <ProjectsGridSection />
    </MainLayout>
  );
};
