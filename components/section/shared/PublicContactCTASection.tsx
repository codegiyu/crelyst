'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ReactNode } from 'react';

const DEFAULT_BG = '/images/bg-section-8.jpg';

export type PublicContactCTASectionProps = {
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
  title,
  description,
  buttonLabel,
  contactHref = '/contact',
  motionDelay = 0.4,
  backgroundImageSrc = DEFAULT_BG,
}: PublicContactCTASectionProps) {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: motionDelay }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImageSrc}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 px-6 py-16 text-center sm:px-10 md:px-12 md:py-20 lg:py-24">
          <h3 className="mb-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h3>
          <p className="mx-auto mb-6 max-w-lg text-muted-foreground">{description}</p>
          <RegularBtn linkProps={{ href: contactHref }} className="px-8">
            {buttonLabel}
          </RegularBtn>
        </div>
      </motion.div>
    </SectionContainer>
  );
}
