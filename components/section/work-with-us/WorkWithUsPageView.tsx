'use client';

import { WorkWithUsHeroSection } from './WorkWithUsHeroSection';
import { WorkWithUsFormSection } from './WorkWithUsFormSection';
import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';

export const WorkWithUsPageView = () => {
  return (
    <>
      <WorkWithUsHeroSection />
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
