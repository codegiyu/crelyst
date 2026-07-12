import { describe, expect, it } from 'vitest';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import {
  filterActiveTestimonials,
  getTestimonialSwiperLoopAdditionalSlides,
  shouldShowTestimonialNav,
  sortTestimonialsForDisplay,
} from './testimonialDisplay';

function t(
  id: string,
  displayOrder: number,
  isActive = true,
  isFeatured = false
): ClientTestimonial {
  return {
    _id: id,
    clientName: `Client ${id}`,
    testimonial: `Quote ${id}`,
    isFeatured,
    isActive,
    displayOrder,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
}

describe('sortTestimonialsForDisplay', () => {
  it('sorts by displayOrder then _id', () => {
    const sorted = sortTestimonialsForDisplay([t('b', 2), t('a', 1), t('c', 1)], {
      featuredFirst: false,
    });

    expect(sorted.map(x => x._id)).toEqual(['a', 'c', 'b']);
  });

  it('prioritizes featured testimonials before displayOrder', () => {
    const sorted = sortTestimonialsForDisplay([t('low', 0), t('featured', 5, true, true)]);

    expect(sorted.map(x => x._id)).toEqual(['featured', 'low']);
  });
});

describe('filterActiveTestimonials', () => {
  it('excludes inactive testimonials', () => {
    const active = filterActiveTestimonials([t('1', 1), t('2', 2, false)]);

    expect(active.map(x => x._id)).toEqual(['1']);
  });
});

describe('shouldShowTestimonialNav', () => {
  it('returns false for zero or one item', () => {
    expect(shouldShowTestimonialNav(0)).toBe(false);
    expect(shouldShowTestimonialNav(1)).toBe(false);
  });

  it('returns true for two or more items', () => {
    expect(shouldShowTestimonialNav(2)).toBe(true);
    expect(shouldShowTestimonialNav(5)).toBe(true);
  });
});

describe('getTestimonialSwiperLoopAdditionalSlides', () => {
  it('returns at least two for loop duplication', () => {
    expect(getTestimonialSwiperLoopAdditionalSlides(1)).toBe(2);
    expect(getTestimonialSwiperLoopAdditionalSlides(5)).toBe(5);
  });
});
