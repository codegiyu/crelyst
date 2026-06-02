import type { ClientTestimonial } from '@/lib/constants/endpoints';

export const MIN_TESTIMONIALS_TO_SPLIT = 4;

export function sortTestimonialsForDisplay(testimonials: ClientTestimonial[]): ClientTestimonial[] {
  return [...testimonials].sort((a, b) => {
    const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    if (orderDiff !== 0) return orderDiff;

    return a._id.localeCompare(b._id);
  });
}

export function splitTestimonialsIntoMarqueeRows(testimonials: ClientTestimonial[]): {
  row1: ClientTestimonial[];
  row2: ClientTestimonial[];
} {
  const sorted = sortTestimonialsForDisplay(testimonials);

  if (sorted.length === 0) {
    return { row1: [], row2: [] };
  }

  if (sorted.length < MIN_TESTIMONIALS_TO_SPLIT) {
    return { row1: sorted, row2: sorted };
  }

  const splitAt = Math.ceil(sorted.length / 2);

  return {
    row1: sorted.slice(0, splitAt),
    row2: sorted.slice(splitAt),
  };
}

export function prepareMarqueeTrack(items: ClientTestimonial[]): ClientTestimonial[] {
  if (items.length === 0) return [];

  return [...items, ...items];
}

export function filterActiveTestimonials(testimonials: ClientTestimonial[]): ClientTestimonial[] {
  return testimonials.filter(t => t.isActive !== false);
}

export function getMarqueeDurationSeconds(itemCount: number, reducedMotion: boolean): number {
  const base = Math.max(itemCount * 8, 24);

  if (!reducedMotion) return base;

  return Math.max(base * 5, 120);
}
