import { describe, expect, it } from 'vitest';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import {
  MIN_TESTIMONIALS_TO_SPLIT,
  prepareMarqueeTrack,
  sortTestimonialsForDisplay,
  splitTestimonialsIntoMarqueeRows,
} from './testimonialMarqueeRows';

function t(id: string, displayOrder: number): ClientTestimonial {
  return {
    _id: id,
    clientName: `Client ${id}`,
    testimonial: `Quote ${id}`,
    isFeatured: false,
    isActive: true,
    displayOrder,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };
}

describe('sortTestimonialsForDisplay', () => {
  it('sorts by displayOrder then _id', () => {
    const sorted = sortTestimonialsForDisplay([t('b', 2), t('a', 1), t('c', 1)]);

    expect(sorted.map(x => x._id)).toEqual(['a', 'c', 'b']);
  });
});

describe('splitTestimonialsIntoMarqueeRows', () => {
  it('returns empty rows for no items', () => {
    expect(splitTestimonialsIntoMarqueeRows([])).toEqual({ row1: [], row2: [] });
  });

  it('duplicates the same list on both rows when below split threshold', () => {
    const items = [t('1', 1), t('2', 2), t('3', 3)];
    const { row1, row2 } = splitTestimonialsIntoMarqueeRows(items);

    expect(row1.map(x => x._id)).toEqual(['1', '2', '3']);
    expect(row2.map(x => x._id)).toEqual(['1', '2', '3']);
  });

  it('splits into two halves when at or above threshold', () => {
    const items = Array.from({ length: MIN_TESTIMONIALS_TO_SPLIT }, (_, i) =>
      t(String(i + 1), i + 1)
    );
    const { row1, row2 } = splitTestimonialsIntoMarqueeRows(items);

    expect(row1).toHaveLength(2);
    expect(row2).toHaveLength(2);
    expect(row1.map(x => x._id)).toEqual(['1', '2']);
    expect(row2.map(x => x._id)).toEqual(['3', '4']);
  });

  it('splits odd counts with ceil on first row', () => {
    const items = [t('1', 1), t('2', 2), t('3', 3), t('4', 4), t('5', 5)];
    const { row1, row2 } = splitTestimonialsIntoMarqueeRows(items);

    expect(row1.map(x => x._id)).toEqual(['1', '2', '3']);
    expect(row2.map(x => x._id)).toEqual(['4', '5']);
  });
});

describe('prepareMarqueeTrack', () => {
  it('duplicates items for seamless loop', () => {
    const items = [t('1', 1), t('2', 2)];
    const track = prepareMarqueeTrack(items);

    expect(track.map(x => x._id)).toEqual(['1', '2', '1', '2']);
  });
});
