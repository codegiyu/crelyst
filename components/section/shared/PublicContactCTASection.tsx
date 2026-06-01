'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { shouldRevealMotion } from '@/lib/utils/motionReveal';
import type { ReactNode } from 'react';

const DEFAULT_BG = '/images/bg-section-8.jpg';

export type PublicContactCTASectionProps = {
  immediate?: boolean;
  caption?: string;
  title: string;
  description: ReactNode;
  buttonLabel: string;
  contactHref?: string;
  /** Stagger with surrounding motion sections */
  motionDelay?: number;
  /** Override background (default: bg-section-8) */
  backgroundImageSrc?: string;
};

export function PublicContactCTASection({
  immediate,
  caption = "Let's Talk",
  title,
  description,
  buttonLabel,
  contactHref = '/contact',
  motionDelay = 0.4,
  backgroundImageSrc = DEFAULT_BG,
}: PublicContactCTASectionProps) {
  const { siteLoading } = useSiteStore(state => state);
  const reveal = shouldRevealMotion(siteLoading, immediate);

  return (
    <SectionContainer className="py-0 md:py-0 lg:py-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={reveal ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: motionDelay }}
        viewport={{ once: true }}
        className="relative flex min-h-[400px] md:min-h-[500px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border">
        <div
          className="absolute inset-0 bg-cover bg-bottom-right"
          style={{ backgroundImage: `url('${backgroundImageSrc}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-12 text-center sm:px-10 md:px-12">
          <SectionHeading
            static
            caption={caption}
            title={title}
            text={typeof description === 'string' ? description : undefined}
            variant="compact"
            spacing="none"
            className="mb-6 [&_p:last-of-type]:mx-auto [&_p:last-of-type]:max-w-lg"
          />
          {typeof description !== 'string' && (
            <p className="mx-auto mb-6 max-w-lg text-muted-foreground">{description}</p>
          )}
          <RegularBtn linkProps={{ href: contactHref }} className="px-8">
            {buttonLabel}
          </RegularBtn>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
