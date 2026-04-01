'use client';

import { ProjectsHeroSection } from './ProjectsHeroSection';
import { ProjectsGridSection } from './ProjectsGridSection';
import type { ClientProject } from '@/lib/constants/endpoints';

export const ProjectsPageView = ({ projects }: { projects: ClientProject[] }) => {
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsGridSection projects={projects} />
    </>
  );
};
