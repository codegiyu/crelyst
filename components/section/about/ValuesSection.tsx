'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Target, Heart, Lightbulb, Shield } from 'lucide-react';
import { LucideIconComp } from '@/lib/types/general';
import { shouldRevealMotion } from '@/lib/utils/motionReveal';
import {
  DEFAULT_ABOUT_PAGE_CONTENT,
  type AboutValueIconKey,
  type AboutValuesContent,
} from '@/lib/types/about-page';

interface ValueCardProps {
  Icon: LucideIconComp;
  title: string;
  description: string;
  index: number;
  immediate?: boolean;
}

const ICON_MAP: Record<AboutValueIconKey, LucideIconComp> = {
  lightbulb: Lightbulb,
  heart: Heart,
  target: Target,
  shield: Shield,
};

const ValueCard = ({ Icon, title, description, index, immediate }: ValueCardProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const reveal = shouldRevealMotion(siteLoading, immediate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={reveal ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300">
      <div className="w-14 h-14 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

type ValuesSectionProps = {
  immediate?: boolean;
  content?: AboutValuesContent;
};

export const ValuesSection = ({
  immediate,
  content = DEFAULT_ABOUT_PAGE_CONTENT.values,
}: ValuesSectionProps = {}) => {
  return (
    <SectionContainer>
      <SectionHeading
        immediate={immediate}
        caption={content.caption}
        title={content.title}
        text={content.text}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.items.map((value, index) => (
          <ValueCard
            key={`${value.title}-${index}`}
            Icon={ICON_MAP[value.iconKey] ?? Lightbulb}
            title={value.title}
            description={value.description}
            index={index}
            immediate={immediate}
          />
        ))}
      </div>
    </SectionContainer>
  );
};
