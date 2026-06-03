import type { ClientTestimonial } from '@/lib/constants/endpoints';

export function sortTestimonialsForDisplay(testimonials: ClientTestimonial[]): ClientTestimonial[] {
  return [...testimonials].sort((a, b) => {
    const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;

    return a._id.localeCompare(b._id);
  });
}

export function filterActiveTestimonials(testimonials: ClientTestimonial[]): ClientTestimonial[] {
  return testimonials.filter(t => t.isActive !== false);
}

export function shouldShowTestimonialNav(count: number): boolean {
  return count > 1;
}

export function getTestimonialSwiperLoopAdditionalSlides(slideCount: number): number {
  return Math.max(slideCount, 2);
}
