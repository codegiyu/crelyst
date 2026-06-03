'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const TESTIMONIAL_SWIPER_PREV_CLASS = 'testimonial-swiper-prev';
export const TESTIMONIAL_SWIPER_NEXT_CLASS = 'testimonial-swiper-next';

type TestimonialSwiperControlsProps = {
  showNav?: boolean;
  className?: string;
};

export function TestimonialSwiperControls({
  showNav = true,
  className,
}: TestimonialSwiperControlsProps) {
  if (!showNav) return null;

  return (
    <div
      className={cn('flex items-center justify-center gap-3', className)}
      role="group"
      aria-label="Testimonial slider controls">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          TESTIMONIAL_SWIPER_PREV_CLASS,
          'size-11 shrink-0 border-border bg-card hover:border-primary/35'
        )}
        aria-label="Previous testimonial">
        <ChevronLeft className="size-5" aria-hidden />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(
          TESTIMONIAL_SWIPER_NEXT_CLASS,
          'size-11 shrink-0 border-border bg-card hover:border-primary/35'
        )}
        aria-label="Next testimonial">
        <ChevronRight className="size-5" aria-hidden />
      </Button>
    </div>
  );
}
