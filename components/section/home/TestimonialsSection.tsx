'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { TestimonialCard } from '@/components/general/TestimonialCard';
import {
  TESTIMONIAL_SWIPER_NEXT_CLASS,
  TESTIMONIAL_SWIPER_PREV_CLASS,
  TestimonialSwiperControls,
} from '@/components/general/TestimonialSwiperControls';
import { SectionHeading } from '@/components/general/SectionHeading';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import {
  filterActiveTestimonials,
  getTestimonialSwiperLoopAdditionalSlides,
  sortTestimonialsForDisplay,
} from '@/lib/utils/testimonialDisplay';
import { cn } from '@/lib/utils';

export const TestimonialsSection = ({ testimonials }: { testimonials: ClientTestimonial[] }) => {
  const active = sortTestimonialsForDisplay(filterActiveTestimonials(testimonials));

  if (active.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('testimonial-swiper w-full section-padding bg-muted/30 overflow-x-clip')}
      aria-roledescription="carousel"
      aria-label="Client testimonials">
      <div className="regular-container mb-8 md:mb-10">
        <SectionHeading
          caption="Testimonials"
          title="What Our Clients Say"
          text="Don't just take our word for it — hear from the businesses we've helped succeed"
          align="start"
          spacing="none"
        />
      </div>

      <div className="flex w-full flex-col-reverse">
        <TestimonialSwiperControls showNav className="mt-4" />

        <Swiper
          modules={[Navigation, Pagination, A11y, Keyboard]}
          loop={active.length > 1}
          loopAdditionalSlides={getTestimonialSwiperLoopAdditionalSlides(active.length)}
          slidesPerView={1}
          spaceBetween={24}
          speed={450}
          keyboard={{ enabled: true }}
          a11y={{
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
            paginationBulletMessage: 'Go to testimonial {{index}}',
          }}
          pagination={{
            type: 'bullets',
            clickable: true,
          }}
          navigation={{
            prevEl: `.${TESTIMONIAL_SWIPER_PREV_CLASS}`,
            nextEl: `.${TESTIMONIAL_SWIPER_NEXT_CLASS}`,
          }}
          className="testimonial-swiper__track w-full pb-12">
          {active.map(testimonial => (
            <SwiperSlide key={testimonial._id} className="!h-auto">
              <div className="flex justify-center px-4 sm:px-6 md:px-8">
                <TestimonialCard
                  testimonial={testimonial}
                  static
                  className="w-full max-w-[32rem]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
