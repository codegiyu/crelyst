'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';
import { ClientTestimonial } from '@/lib/constants/endpoints';
import { MessageSquareQuote, Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: ClientTestimonial;
  index: number;
}) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group p-6 md:p-8 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300 relative">
      {/* Quote icon */}
      <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
        <Quote className="w-12 h-12" />
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < testimonial.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`}
            />
          ))}
        </div>
      )}

      {/* Testimonial text */}
      <p className="text-foreground mb-6 leading-relaxed relative z-10">
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {testimonial.clientImage ? (
          <img
            src={testimonial.clientImage}
            alt={testimonial.clientName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {testimonial.clientName.charAt(0)}
            </span>
          </div>
        )}

        <div>
          <div className="font-semibold text-foreground">{testimonial.clientName}</div>
          <div className="text-sm text-muted-foreground">
            {testimonial.clientRole}
            {testimonial.companyName && ` at ${testimonial.companyName}`}
          </div>
        </div>

        {testimonial.companyLogo && (
          <img
            src={testimonial.companyLogo}
            alt={testimonial.companyName || 'Company'}
            className="h-8 ml-auto"
          />
        )}
      </div>
    </motion.div>
  );
};

export const TestimonialsSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { testimonials, isLoading } = useTestimonialsStore(state => ({
    testimonials: state.testimonials,
    isLoading: state.isLoading,
  }));

  // Get featured testimonials first, then by display order
  const displayTestimonials = [...testimonials]
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    })
    .slice(0, 6);

  if (!isLoading && displayTestimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <SectionContainer background="muted">
      <SectionHeading
        Icon={MessageSquareQuote}
        title="What Our Clients Say"
        text="Don't just take our word for it - hear from the businesses we've helped succeed"
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl border border-border">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Skeleton key={j} className="w-4 h-4 rounded" />
                ))}
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} index={index} />
          ))}
        </motion.div>
      )}
    </SectionContainer>
  );
};
