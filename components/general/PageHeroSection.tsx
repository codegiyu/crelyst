'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeroSectionProps {
  bannerImage?: string;
  title: string | ReactNode;
  description: string;
  badge?: string | ReactNode;
  additionalContent?: ReactNode;
  titleFont?: 'serif' | 'sans';
  gradientColors?: {
    from?: string;
    via?: string;
    to?: string;
  };
}

export const PageHeroSection = ({
  bannerImage,
  title,
  description,
  badge,
  additionalContent,
  titleFont = 'sans',
  gradientColors = {
    from: 'from-primary/5',
    via: 'via-background',
    to: 'to-accent/5',
  },
}: PageHeroSectionProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <div className="relative w-full">
      {/* Banner Image - Full Height Background */}
      {bannerImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      )}

      <SectionContainer
        className={cn(
          'relative z-10 min-h-[min(900px,75vh)] flex items-center',
          bannerImage
            ? ''
            : `bg-gradient-to-br ${gradientColors.from} ${gradientColors.via} ${gradientColors.to}`
        )}>
        {/* Background Pattern */}
        {!bannerImage && <div className="absolute inset-0 pattern-overlay pointer-events-none" />}

        <div className="relative z-10 regular-container w-full">
          <div className="text-center">
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6">
                {typeof badge === 'string' ? (
                  <span
                    className={cn(
                      'inline-block px-4 py-1.5 text-sm font-medium rounded-full',
                      bannerImage
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'bg-primary/10 text-primary'
                    )}>
                    {badge}
                  </span>
                ) : (
                  badge
                )}
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
                titleFont === 'serif' ? 'font-serif' : 'font-sans',
                bannerImage ? 'text-white' : 'text-foreground'
              )}>
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                'text-lg md:text-xl max-w-2xl mx-auto',
                bannerImage ? 'text-white/90' : 'text-muted-foreground',
                additionalContent && 'mb-8'
              )}>
              {description}
            </motion.p>

            {/* Additional Content */}
            {additionalContent && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={cn(bannerImage ? 'text-white/80' : 'text-muted-foreground')}>
                {additionalContent}
              </motion.div>
            )}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};
