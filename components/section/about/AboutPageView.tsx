'use client';

import { PublicContactCTASection } from '@/components/section/shared/PublicContactCTASection';
import { HeroSection } from './HeroSection';
import { AboutStatsSection } from './AboutStatsSection';
import { StorySection } from './StorySection';
import { ValuesSection } from './ValuesSection';
import { TeamSection } from './TeamSection';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { DEFAULT_ABOUT_PAGE_CONTENT, type AboutPageContent } from '@/lib/types/about-page';

export type AboutPageViewProps = {
  teamMembers: ClientTeamMember[];
  aboutPage?: AboutPageContent | null;
};

export const AboutPageView = ({
  teamMembers,
  aboutPage = DEFAULT_ABOUT_PAGE_CONTENT,
}: AboutPageViewProps) => {
  const content = aboutPage ?? DEFAULT_ABOUT_PAGE_CONTENT;

  return (
    <>
      <HeroSection content={content.hero} />
      <AboutStatsSection stats={content.stats} />
      <StorySection content={content.story} />
      <ValuesSection content={content.values} />
      <TeamSection teamMembers={teamMembers} />
      <PublicContactCTASection
        caption={content.cta.caption}
        title={content.cta.title}
        description={content.cta.description}
        buttonLabel={content.cta.buttonLabel}
        contactHref="/contact"
        motionDelay={0.2}
      />
    </>
  );
};
