'use client';

import { GhostBtn } from '@/components/atoms/GhostBtn';
import { cn } from '@/lib/utils';
import { useSiteStore } from '@/lib/store/siteStore';
import { motion } from 'motion/react';
import { ReactNode } from 'react';

export interface SectionCardProps {
  children: ReactNode;
  href?: string;
  className?: string;
  wrapClassName?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  wrapKey?: string | number | null;
  index?: number;
  delayMultiplier?: number;
}

/**
 * Generic Card component with optional link wrapper for sections
 * Use this for section cards that may optionally link to detail pages
 * When wrapKey is provided, the card will re-animate when the key changes
 */
export const SectionCard = ({
  children,
  href,
  className,
  wrapClassName,
  onClick,
  hoverEffect = true,
  wrapKey = null,
  index = 0,
  delayMultiplier = 0.2,
}: SectionCardProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const cardClasses = cn(
    'h-full card-elegant',
    hoverEffect && 'hover:shadow-gold transition-shadow',
    className
  );

  // Build the card content (GhostBtn or div)
  const cardElement = href ? (
    <GhostBtn
      linkProps={{ href }}
      className={cn('w-full h-full text-start', cardClasses)}
      wrapClassName={cn('h-full', wrapClassName)}
      onClick={onClick}>
      {children}
    </GhostBtn>
  ) : (
    <div className={cn(cardClasses, wrapClassName)} onClick={onClick}>
      {children}
    </div>
  );

  // Wrap the entire card in motion.div if wrapKey is provided for animation re-triggering
  if (wrapKey !== null) {
    return (
      <motion.div
        key={wrapKey}
        initial={{ opacity: 0, y: 50 }}
        animate={siteLoading ? {} : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: index * delayMultiplier,
        }}
        viewport={{ once: true, amount: 0 }}
        className="w-full h-full"
        style={{ animationDelay: `${index * delayMultiplier}s` }}>
        {cardElement}
      </motion.div>
    );
  }

  return cardElement;
};

export interface CardGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    base?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

/**
 * Responsive grid container for cards
 * Note: Tailwind requires classes to be statically analyzable.
 * For dynamic columns, use CSS Grid with inline styles or extend Tailwind config.
 */
export const CardGrid = ({
  children,
  className,
  columns = { base: 1, md: 2, lg: 3 },
  gap = 6,
}: CardGridProps) => {
  const gridColumnClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const mdGridColumnClasses: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  };

  const lgGridColumnClasses: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  };

  const xlGridColumnClasses: Record<number, string> = {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
  };

  const gapClasses: Record<number, string> = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };

  const gridClasses = cn(
    'grid',
    gridColumnClasses[columns.base || 1] || 'grid-cols-1',
    columns.md && (mdGridColumnClasses[columns.md] || 'md:grid-cols-2'),
    columns.lg && (lgGridColumnClasses[columns.lg] || 'lg:grid-cols-3'),
    columns.xl && (xlGridColumnClasses[columns.xl] || 'xl:grid-cols-4'),
    gapClasses[gap] || 'gap-6',
    className
  );

  return <div className={gridClasses}>{children}</div>;
};
