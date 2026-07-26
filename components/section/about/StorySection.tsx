'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useSiteStore } from '@/lib/store/siteStore';
import { shouldRevealMotion } from '@/lib/utils/motionReveal';
import { DEFAULT_ABOUT_PAGE_CONTENT, type AboutStoryContent } from '@/lib/types/about-page';

type StorySectionProps = {
  immediate?: boolean;
  content?: AboutStoryContent;
};

export const StorySection = ({
  immediate,
  content = DEFAULT_ABOUT_PAGE_CONTENT.story,
}: StorySectionProps = {}) => {
  const { siteLoading } = useSiteStore(state => state);
  const reveal = shouldRevealMotion(siteLoading, immediate);

  return (
    <SectionContainer background="muted">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={reveal ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={content.imageUrl}
              alt={content.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 -z-10 h-24 w-24 rounded-xl bg-accent/20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={reveal ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}>
          <SectionHeading
            immediate={immediate}
            caption={content.caption}
            title={content.title}
            text={content.subtitle}
            align="start"
            spacing="tight"
          />

          <div className="grid gap-4 text-muted-foreground">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
