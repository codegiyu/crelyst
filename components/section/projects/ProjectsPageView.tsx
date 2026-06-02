'use client';

import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { ProjectsHeroSection } from './ProjectsHeroSection';
import { ProjectsGridSection } from './ProjectsGridSection';
import type { ClientProject } from '@/lib/constants/endpoints';

export const ProjectsPageView = ({ projects }: { projects: ClientProject[] }) => {
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsGridSection projects={projects} />
      <PublicContactCTASection
        caption="Start a project"
        title="Inspired by what you see?"
        description="Tell us about your brand, timeline, and goals — we'll help you build work with the same craft and impact as the projects above."
        buttonLabel="Start Your Project"
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
