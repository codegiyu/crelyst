'use client';
import { useSiteStore } from '@/lib/store/siteStore';
import { PropsWithChildren } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export const FadeInUpWrap = ({
  children,
  className,
  amount = 0.3,
  wrapKey = null,
}: PropsWithChildren<{
  className?: string;
  /**
   * amount is a number between 0 and 1
   *
   * It represents how much of the element should be in view before the animation starts
   */
  amount?: number;
  wrapKey?: string | number | null;
}>) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      key={wrapKey}
      initial={{ opacity: 0, y: 50 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount }}
      className={cn('', className)}>
      {children}
    </motion.div>
  );
};

/**
 * Motion wrapper for full sections with consistent animation
 */
export const FadeInUpSection = ({
  children,
  className,
  amount = 0.3,
}: PropsWithChildren<{
  className?: string;
  amount?: number;
}>) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount }}
      className={cn('', className)}>
      {children}
    </motion.section>
  );
};

/**
 * Motion wrapper for individual cards with automatic delay calculation
 */
export const FadeInUpCard = ({
  children,
  className,
  index = 0,
  delayMultiplier = 0.1,
  amount = 0,
}: PropsWithChildren<{
  className?: string;
  index?: number;
  delayMultiplier?: number;
  amount?: number;
}>) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: index * delayMultiplier,
      }}
      viewport={{ once: true, amount }}
      className={cn('', className)}
      style={{ animationDelay: `${index * delayMultiplier}s` }}>
      {children}
    </motion.div>
  );
};
