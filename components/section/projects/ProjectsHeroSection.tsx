'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';

export const ProjectsHeroSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-accent bg-accent/10 rounded-full">
          Our Portfolio
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif">
          Our Projects
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our portfolio of successful projects that showcase our expertise and commitment to
          delivering exceptional results.
        </motion.p>
      </div>
    </SectionContainer>
  );
};
