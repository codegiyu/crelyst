'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { useCountUp } from '@/lib/hooks/use-count-up';
import { useSiteStore } from '@/lib/store/siteStore';
import { motion } from 'motion/react';

type CountStat = {
  kind: 'count';
  target: number;
  label: string;
};

type StaticStat = {
  kind: 'static';
  value: string;
  label: string;
};

type StatItem = CountStat | StaticStat;

const STATS: readonly StatItem[] = [
  { kind: 'count', target: 150, label: 'Projects' },
  { kind: 'count', target: 50, label: 'Clients' },
  { kind: 'count', target: 5, label: 'Years' },
  { kind: 'static', value: '24/7', label: 'Support' },
];

const countDuration = (target: number) => Math.min(2.8, 1.2 + target / 80);

const CountValue = ({
  target,
  delay,
  siteLoading,
}: {
  target: number;
  delay: number;
  siteLoading: boolean;
}) => {
  const { ref, display, isComplete } = useCountUp({
    end: target,
    duration: countDuration(target),
    delay,
    disabled: siteLoading,
  });

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      <motion.span
        initial={{ opacity: 0, x: -2 }}
        animate={isComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: -2 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden={!isComplete}>
        +
      </motion.span>
    </span>
  );
};

const StatValue = ({
  stat,
  delay,
  siteLoading,
}: {
  stat: StatItem;
  delay: number;
  siteLoading: boolean;
}) => {
  if (stat.kind === 'static') {
    return <span>{stat.value}</span>;
  }

  return <CountValue target={stat.target} delay={delay} siteLoading={siteLoading} />;
};

export const AboutStatsSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer background="surface-deep" className="py-10 md:py-12 lg:py-14">
      <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-x-8">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
            viewport={{ once: true }}
            className="text-center">
            <p className="text-primary text-4xl font-bold tabular-nums md:text-5xl">
              <StatValue stat={stat} delay={0.15 + index * 0.08} siteLoading={siteLoading} />
            </p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground md:text-xs">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
};
