'use client';

import { useEffect, useRef } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useTestimonialsStore } from '@/lib/store/useTestimonialsStore';
import { ClientTestimonial } from '@/lib/constants/endpoints';
import { MessageSquareQuote, Star, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialCard = ({ testimonial }: { testimonial: ClientTestimonial }) => {
  return (
    <div className="group p-8 md:p-12 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300 relative max-w-4xl mx-auto">
      {/* Quote icon */}
      <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors">
        <Quote className="w-12 h-12 md:w-16 md:h-16" />
      </div>

      {/* Rating */}
      {testimonial.rating && (
        <div className="flex items-center gap-1 mb-6 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 md:w-6 md:h-6 ${
                i < testimonial.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
              }`}
            />
          ))}
        </div>
      )}

      {/* Testimonial text */}
      <p className="text-foreground mb-8 leading-relaxed relative z-10 text-lg md:text-xl text-center max-w-3xl mx-auto">
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {testimonial.clientImage ? (
          <img
            src={testimonial.clientImage}
            alt={testimonial.clientName}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xl md:text-2xl font-bold text-primary">
              {testimonial.clientName.charAt(0)}
            </span>
          </div>
        )}

        <div className="text-center md:text-left">
          <div className="font-semibold text-foreground text-base md:text-lg">
            {testimonial.clientName}
          </div>
          <div className="text-sm md:text-base text-muted-foreground">
            {testimonial.clientRole}
            {testimonial.companyName && ` at ${testimonial.companyName}`}
          </div>
        </div>

        {testimonial.companyLogo && (
          <div className="relative h-10 w-24 md:h-12 md:w-32 shrink-0 ml-auto hidden md:block">
            <img
              src={testimonial.companyLogo}
              alt={testimonial.companyName || 'Company'}
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { testimonials, isLoading } = useTestimonialsStore(state => ({
    testimonials: state.testimonials,
    isLoading: state.isLoading,
  }));
  const swiperRef = useRef<SwiperType | null>(null);

  // Filter to only show active and featured testimonials, then sort by display order
  const displayTestimonials = [...testimonials]
    .filter(testimonial => testimonial.isActive !== false && testimonial.isFeatured === true)
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    })
    .slice(0, 6);

  useEffect(() => {
    // Pause autoplay when site is loading
    if (swiperRef.current) {
      if (siteLoading) {
        swiperRef.current.autoplay?.stop();
      } else {
        swiperRef.current.autoplay?.start();
      }
    }
  }, [siteLoading]);

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
        <div className="max-w-4xl mx-auto">
          <div className="p-8 md:p-12 rounded-2xl border border-border">
            <div className="flex gap-1 mb-6 justify-center">
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="w-5 h-5 md:w-6 md:h-6 rounded" />
              ))}
            </div>
            <Skeleton className="h-6 w-full mb-3 max-w-3xl mx-auto" />
            <Skeleton className="h-6 w-full mb-3 max-w-3xl mx-auto" />
            <Skeleton className="h-6 w-3/4 mb-8 max-w-3xl mx-auto" />
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="relative">
          <Swiper
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary/30 !cursor-pointer',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
            }}
            navigation={{
              nextEl: '.testimonial-swiper-button-next',
              prevEl: '.testimonial-swiper-button-prev',
            }}
            loop={displayTestimonials.length > 1}
            speed={600}
            slidesPerView={1}
            spaceBetween={30}
            className="!pb-12">
            {displayTestimonials.map(testimonial => (
              <SwiperSlide key={testimonial._id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            className="testimonial-swiper-button-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary hover:bg-background shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous testimonial">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
          <button
            className="testimonial-swiper-button-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary hover:bg-background shadow-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next testimonial">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
        </motion.div>
      )}
    </SectionContainer>
  );
};
