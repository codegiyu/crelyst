'use client';

import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';
import {
  ABOUT_HERO_BACKGROUND_IMAGE,
  DEFAULT_ABOUT_PAGE_CONTENT,
  type AboutHeroContent,
} from '@/lib/types/about-page';

type HeroSectionProps = {
  immediate?: boolean;
  content?: AboutHeroContent;
};

export const HeroSection = ({
  immediate,
  content = DEFAULT_ABOUT_PAGE_CONTENT.hero,
}: HeroSectionProps = {}) => {
  return (
    <RegularPageHeroSection
      immediate={immediate}
      backgroundImage={ABOUT_HERO_BACKGROUND_IMAGE}
      badge={content.badge}
      title={
        <>
          {content.titleLine1}
          <br />
          {content.titleLine2}
        </>
      }
      description={content.description}
    />
  );
};
