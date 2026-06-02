'use client';

import { useEffect, useRef } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { TestimonialCard } from '@/components/general/TestimonialCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TestimonialsSection = ({ testimonials }: { testimonials: ClientTestimonial[] }) => {
  const { siteLoading } = useSiteStore(state => state);
  const swiperRef = useRef<SwiperType | null>(null);

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

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <SectionContainer background="muted">
      <SectionHeading
        caption="Testimonials"
        title="What Our Clients Say"
        text="Don't just take our word for it - hear from the businesses we've helped succeed"
      />

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
            <SwiperSlide key={testimonial._id} className="!flex !justify-center">
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
    </SectionContainer>
  );
};
