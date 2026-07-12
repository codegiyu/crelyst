import type { ClientTestimonial } from '@/lib/constants/endpoints';

export function sortTestimonialsForDisplay(
  testimonials: ClientTestimonial[],
  options?: { featuredFirst?: boolean }
): ClientTestimonial[] {
  const featuredFirst = options?.featuredFirst ?? true;

  return [...testimonials].sort((a, b) => {
    if (featuredFirst) {
      const featuredDiff = Number(b.isFeatured) - Number(a.isFeatured);
      if (featuredDiff !== 0) return featuredDiff;
    }

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
