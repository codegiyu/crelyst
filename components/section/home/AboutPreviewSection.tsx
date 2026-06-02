'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { useCountUp } from '@/lib/hooks/use-count-up';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Check, ArrowRight } from 'lucide-react';

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

const STATS = {
  left: [
    { kind: 'count', target: 150, label: 'Projects Completed' },
    { kind: 'count', target: 5, label: 'Years Excellence' },
  ],
  right: [
    { kind: 'count', target: 50, label: 'Global Clients' },
    { kind: 'static', value: '24/7', label: 'Active Support' },
  ],
} satisfies { left: StatItem[]; right: StatItem[] };

const FEATURES = [
  '5+ years of experience',
  'Creative excellence in all designs',
  'Brand storytelling that resonates',
  'End-to-end design solutions',
  'Collaborative design process',
  'Award-winning visual identities',
];

const countDuration = (target: number) => Math.min(2.8, 1.2 + target / 80);

const CountStatValue = ({
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

  return <CountStatValue target={stat.target} delay={delay} siteLoading={siteLoading} />;
};

const StatCard = ({
  stat,
  delay,
  siteLoading,
}: {
  stat: StatItem;
  delay: number;
  siteLoading: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="rounded-xl border border-white/3 bg-stat-card p-6 md:p-8">
    <div className="text-3xl font-bold tabular-nums text-primary md:text-4xl">
      <StatValue stat={stat} delay={delay} siteLoading={siteLoading} />
    </div>
    <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground md:text-[11px]">
      {stat.label}
    </div>
  </motion.div>
);

export const AboutPreviewSection = () => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer background="surface-deep">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Visual side — staggered stat cards */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1">
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="flex flex-col gap-4 md:gap-5">
              {STATS.left.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  delay={0.2 + index * 0.1}
                  siteLoading={siteLoading}
                />
              ))}
            </div>

            <div className="flex flex-col gap-4 pt-10 md:gap-5 md:pt-14">
              {STATS.right.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  delay={0.3 + index * 0.1}
                  siteLoading={siteLoading}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2">
          <SectionHeading
            caption="Why Choose Us"
            title={
              <>
                We Transform Vision into <span className="text-primary">Digital Success</span>
              </>
            }
            align="start"
            spacing="tight"
            className="mb-6 gap-4"
          />

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            With a passion for innovation and a commitment to excellence, we partner with businesses
            to create digital solutions that not only meet expectations but exceed them. Our
            collaborative approach ensures your vision comes to life exactly as you imagined.
          </p>

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-3 text-primary-foreground stroke-[3]" />
                </div>
                <span className="text-base text-foreground/90">{feature}</span>
              </motion.div>
            ))}
          </div>

          <RegularBtn
            linkProps={{ href: '/about' }}
            RightIcon={ArrowRight}
            rightIconProps={{ className: 'size-4 group-hover:translate-x-1 transition-transform' }}
            text="Learn More About Us"
            className="group"
          />
        </motion.div>
      </div>
    </SectionContainer>
  );
};
