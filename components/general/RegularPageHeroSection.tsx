'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { useSiteStore } from '@/lib/store/siteStore';
import { shouldRevealMotion } from '@/lib/utils/motionReveal';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

type RegularPageHeroSectionProps = {
  immediate?: boolean;
  backgroundImage: string;
  badge: string | ReactNode;
  title: string | ReactNode;
  description: string;
  className?: string;
};

export const RegularPageHeroSection = ({
  immediate,
  backgroundImage,
  badge,
  title,
  description,
  className,
}: RegularPageHeroSectionProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const reveal = shouldRevealMotion(siteLoading, immediate);

  return (
    <section className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80" />

      <SectionContainer className="relative z-10 min-h-[min(880px,74vh)] flex items-center py-24 md:py-28">
        <div className="content-focus space-y-6 text-left">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={reveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-primary text-[11px] font-medium uppercase tracking-[0.28em] md:text-xs">
            {badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="content-focus-wide text-base leading-relaxed text-white/85 md:text-lg lg:text-xl">
            {description}
          </motion.p>
        </div>
      </SectionContainer>
    </section>
  );
};
