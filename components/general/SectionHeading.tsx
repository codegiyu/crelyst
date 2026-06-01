'use client';

import { useSiteStore } from '@/lib/store/siteStore';
import { cn } from '@/lib/utils';
import { shouldRevealMotion } from '@/lib/utils/motionReveal';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

/** Eyebrow above section titles — matches What We Create card captions on the homepage. */
export const sectionCaptionClassName =
  'text-[11px] font-medium uppercase tracking-[0.28em] md:text-xs';

export const sectionTitleClassName =
  'text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight';

export const sectionTitleCompactClassName =
  'text-2xl md:text-3xl font-bold font-heading leading-tight';

export interface SectionHeadingProps {
  immediate?: boolean;
  /** Skip enter animation (parent section handles motion). */
  static?: boolean;
  caption: string;
  title: ReactNode;
  text?: string;
  className?: string;
  whiteText?: boolean;
  variant?: 'default' | 'compact';
  align?: 'center' | 'start';
  spacing?: 'section' | 'tight' | 'none';
}

export const SectionHeading = ({
  immediate,
  static: isStatic,
  caption,
  title,
  text,
  className,
  whiteText,
  variant = 'default',
  align = 'center',
  spacing = 'section',
}: SectionHeadingProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const reveal = shouldRevealMotion(siteLoading, immediate);
  const isStart = align === 'start' || className?.includes('text-start');

  const spacingClass = {
    section: 'mb-16',
    tight: 'mb-8',
    none: 'mb-0',
  }[spacing];

  const contentClassName = cn(
    'grid gap-4',
    isStart ? 'text-start' : 'text-center',
    spacingClass,
    className
  );

  const inner = (
    <>
      <p
        className={cn(
          sectionCaptionClassName,
          whiteText ? 'text-primary-foreground' : 'text-primary'
        )}>
        {caption}
      </p>
      <h2
        className={cn(
          variant === 'compact' ? sectionTitleCompactClassName : sectionTitleClassName,
          whiteText ? 'text-primary-foreground' : 'text-foreground'
        )}>
        {title}
      </h2>
      {text ? (
        <p
          className={cn(
            'max-w-3xl text-sm md:text-xl leading-relaxed',
            whiteText ? 'text-primary-foreground/90' : 'text-muted-foreground',
            !isStart && 'mx-auto px-2'
          )}>
          {text}
        </p>
      ) : null}
    </>
  );

  if (isStatic) {
    return <div className={contentClassName}>{inner}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={reveal ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 1 }}
      className={contentClassName}>
      {inner}
    </motion.div>
  );
};
