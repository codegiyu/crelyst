'use client';

import { useSiteStore } from '@/lib/store/siteStore';
import { LucideIconComp } from '@/lib/types/general';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export interface SectionHeadingProps {
  Icon?: LucideIconComp;
  title: string;
  text?: string;
  className?: string;
  whiteText?: boolean;
}

export const SectionHeading = ({
  Icon,
  title,
  text,
  className,
  whiteText,
}: SectionHeadingProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 1 }}
      className={cn('text-center grid gap-4 mb-16', className)}>
      {Icon && (
        <Icon
          className={`size-12 text-primary ${className?.includes('text-start') ? '' : 'mx-auto'}`}
        />
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight 
        ${whiteText ? 'text-primary-foreground' : 'text-primary'}`}>
        {title}
      </h2>
      <p
        className={`max-w-3xl text-sm md:text-xl 
        ${whiteText ? 'text-primary-foreground/90' : 'text-muted-foreground'} 
        ${className?.includes('text-start') ? '' : 'px-2 mx-auto'}`}>
        {text}
      </p>
    </motion.div>
  );
};
