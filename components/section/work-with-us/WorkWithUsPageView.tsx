'use client';

import { WorkWithUsHeroSection } from './WorkWithUsHeroSection';
import { WorkWithUsFormSection } from './WorkWithUsFormSection';
import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { ProjectWorkflowSection } from '@/components/section/shared/ProjectWorkflowSection';
import type { ProjectWorkflow } from '@/lib/types/site-settings';

type WorkWithUsPageViewProps = {
  projectWorkflow?: ProjectWorkflow | null;
};

export const WorkWithUsPageView = ({ projectWorkflow }: WorkWithUsPageViewProps) => {
  return (
    <>
      <WorkWithUsHeroSection />
      {projectWorkflow ? <ProjectWorkflowSection workflow={projectWorkflow} /> : null}
      <WorkWithUsFormSection />
      <PublicContactCTASection
        caption="Questions?"
        title="Not sure if you fit?"
        description="Reach out through our contact page — we'd love to hear from you and point you in the right direction."
        buttonLabel="Contact Us"
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
