'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { Target, Heart, Lightbulb, Shield } from 'lucide-react';
import { LucideIconComp } from '@/lib/types/general';

interface ValueCardProps {
  Icon: LucideIconComp;
  title: string;
  description: string;
  index: number;
}

const ValueCard = ({ Icon, title, description, index }: ValueCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
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

const VALUES = [
  {
    Icon: Lightbulb,
    title: 'Creative Vision',
    description:
      "We see design as storytelling. Every color, shape, and texture is chosen to express your brand's unique personality and connect with your audience on an emotional level.",
  },
  {
    Icon: Heart,
    title: 'Artistic Expression',
    description:
      'We believe in bold, expressive designs that break free from corporate templates. Our work is art-driven, memorable, and distinctly creative.',
  },
  {
    Icon: Target,
    title: 'Visual Storytelling',
    description:
      "Through photography, branding, and design, we help brands communicate their essence. We don't just make things look good—we make them speak.",
  },
  {
    Icon: Shield,
    title: 'Collaborative Spirit',
    description:
      "We partner with talented freelancers and work closely with clients to bring diverse perspectives together, creating work that's greater than the sum of its parts.",
  },
];

export const ValuesSection = () => {
  return (
    <SectionContainer>
      <SectionHeading title="Our Values" text="The principles that guide everything we do" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {VALUES.map((value, index) => (
          <ValueCard key={value.title} {...value} index={index} />
        ))}
      </div>
    </SectionContainer>
  );
};
