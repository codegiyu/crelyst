'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ArrowRight, Play, Palette } from 'lucide-react';
import { CRELYST_TAGLINE } from '@/lib/constants/texts';

export const HeroSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-20 h-20 rounded-2xl bg-primary/10 blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-40 right-[15%] w-32 h-32 rounded-full bg-accent/10 blur-sm"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 left-[20%] w-16 h-16 rounded-lg bg-secondary/10 blur-sm"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-[25%] w-24 h-24 rounded-full bg-primary/5"
        />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-50" />

      <SectionContainer className="relative z-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-primary/10 rounded-full border border-primary/20">
            <Palette className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Creative Design Agency</span>
          </motion.div>

          {/* Tagline - Prominent */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-xl sm:text-2xl md:text-3xl font-light text-primary mb-4 font-serif italic">
            {CRELYST_TAGLINE}
          </motion.h2>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-sans leading-[1.1]">
            Where{' '}
            <span className="relative">
              <span className="text-primary">Creativity</span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={siteLoading ? {} : { pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none">
                <motion.path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
            <br />
            Meets Vision
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            We're a full-service design and branding agency specializing in photography, brand
            design, product design, packaging, and visual identity. We help brands express their
            unique personality through powerful visuals and storytelling.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <RegularBtn
              linkProps={{ href: '/contact' }}
              className="px-8 py-6 text-lg group"
              RightIcon={ArrowRight}
              rightIconProps={{
                className: 'size-5 group-hover:translate-x-1 transition-transform',
              }}
              text="Request a Quote"
            />

            <GhostBtn
              linkProps={{ href: '/projects' }}
              className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary transition-colors group">
              <span className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Play className="w-5 h-5 ml-0.5" />
              </span>
              <span className="font-medium">View Our Work</span>
            </GhostBtn>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-16 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '150+', label: 'Projects Delivered' },
                { value: '50+', label: 'Happy Clients' },
                { value: '10+', label: 'Years Experience' },
                { value: '99%', label: 'Client Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={siteLoading ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
};
