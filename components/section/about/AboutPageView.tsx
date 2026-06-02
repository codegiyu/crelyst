'use client';

import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { HeroSection } from './HeroSection';
import { AboutStatsSection } from './AboutStatsSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { TeamSection } from './TeamSection';
import type { ClientTeamMember } from '@/lib/constants/endpoints';

export type AboutPageViewProps = {
  teamMembers: ClientTeamMember[];
};

export const AboutPageView = ({ teamMembers }: AboutPageViewProps) => {
  return (
    <>
      <HeroSection />
      <AboutStatsSection />
      <StorySection />
      <ValuesSection />
      <TeamSection teamMembers={teamMembers} />
      <PublicContactCTASection
        caption="Work with us"
        title="Ready to bring your story to life?"
        description="You know who we are and how we work — tell us about your brand and goals, and we'll craft visuals that reflect your values with the same care you see across our team and work."
        buttonLabel="Start Your Project"
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
