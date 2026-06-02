'use client';

import { motion, useReducedMotion } from 'motion/react';
import { TestimonialCard } from '@/components/general/TestimonialCard';
import { SectionHeading } from '@/components/general/SectionHeading';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import {
  filterActiveTestimonials,
  getMarqueeDurationSeconds,
  prepareMarqueeTrack,
  splitTestimonialsIntoMarqueeRows,
} from '@/lib/utils/testimonialMarqueeRows';
import { cn } from '@/lib/utils';

type MarqueeDirection = 'forward' | 'reverse';

function TestimonialMarqueeRow({
  items,
  direction,
  reducedMotion,
}: {
  items: ClientTestimonial[];
  direction: MarqueeDirection;
  reducedMotion: boolean;
}) {
  const track = prepareMarqueeTrack(items);
  const duration = getMarqueeDurationSeconds(items.length, reducedMotion);

  if (track.length === 0) return null;

  const animate = direction === 'forward' ? { x: ['0%', '-50%'] } : { x: ['-50%', '0%'] };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-16"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-16"
      />

      <div className="overflow-hidden">
        <motion.div
          className="flex w-max shrink-0 items-stretch gap-5 md:gap-6"
          animate={animate}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}>
          {track.map((testimonial, index) => (
            <div
              key={`${testimonial._id}-${index}`}
              className="shrink-0"
              aria-hidden={index >= items.length ? true : undefined}>
              <TestimonialCard testimonial={testimonial} static />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export const TestimonialsSection = ({ testimonials }: { testimonials: ClientTestimonial[] }) => {
  const reducedMotion = useReducedMotion() ?? false;
  const active = filterActiveTestimonials(testimonials);
  const { row1, row2 } = splitTestimonialsIntoMarqueeRows(active);

  if (active.length === 0) {
    return null;
  }

  return (
    <section className={cn('w-full section-padding bg-muted/30 overflow-x-clip')}>
      <div className="regular-container mb-8 md:mb-10">
        <SectionHeading
          caption="Testimonials"
          title="What Our Clients Say"
          text="Don't just take our word for it — hear from the businesses we've helped succeed"
          align="start"
          spacing="none"
        />
      </div>

      <div className="space-y-5 md:space-y-6">
        <TestimonialMarqueeRow items={row1} direction="forward" reducedMotion={reducedMotion} />
        <TestimonialMarqueeRow items={row2} direction="reverse" reducedMotion={reducedMotion} />
      </div>
    </section>
  );
};
