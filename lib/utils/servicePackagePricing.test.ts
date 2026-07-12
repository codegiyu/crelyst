import { describe, expect, it } from 'vitest';
import {
  formatPackageIdLabel,
  getPackageDisplayTitle,
  getPackagePriceLabel,
  getPricingCategoryTitle,
  getPricingGridClassName,
  isPackageFeatured,
} from './servicePackagePricing';

describe('formatPackageIdLabel', () => {
  it('formats slug-like ids into title case', () => {
    expect(formatPackageIdLabel('label-design')).toBe('Label Design');
    expect(formatPackageIdLabel('pitch_deck_presentation')).toBe('Pitch Deck Presentation');
  });
});

describe('getPackageDisplayTitle', () => {
  it('prefers explicit title over formatted id', () => {
    expect(getPackageDisplayTitle({ id: 'basic', title: 'Label Design' })).toBe('Label Design');
  });

  it('falls back to formatted id', () => {
    expect(getPackageDisplayTitle({ id: 'label-design' })).toBe('Label Design');
  });
});

describe('getPricingCategoryTitle', () => {
  it('prefers explicit category title', () => {
    expect(
      getPricingCategoryTitle({
        id: 'packaging_design',
        title: 'Scope of Packaging Design & Pricing',
      })
    ).toBe('Scope of Packaging Design & Pricing');
  });
});

describe('getPackagePriceLabel', () => {
  it('returns contact when price is missing', () => {
    expect(getPackagePriceLabel(undefined)).toEqual({ kind: 'contact' });
    expect(getPackagePriceLabel([])).toEqual({ kind: 'contact' });
  });

  it('returns from label for a single minimum price', () => {
    expect(getPackagePriceLabel([100000])).toEqual({
      kind: 'from',
      amountLabel: '100,000',
    });
  });

  it('returns range label when min and max differ', () => {
    expect(getPackagePriceLabel([100000, 250000])).toEqual({
      kind: 'range',
      amountLabel: '100,000 – 250,000',
    });
  });
});

describe('getPricingGridClassName', () => {
  it('supports up to four pricing cards', () => {
    expect(getPricingGridClassName(4)).toContain('lg:grid-cols-4');
    expect(getPricingGridClassName(3)).toContain('lg:grid-cols-3');
  });
});

describe('isPackageFeatured', () => {
  it('respects explicit isFeatured flag', () => {
    expect(isPackageFeatured({ isFeatured: true }, 0)).toBe(true);
    expect(isPackageFeatured({ isFeatured: false }, 1)).toBe(false);
  });

  it('falls back to middle card when isFeatured is unset', () => {
    expect(isPackageFeatured({}, 1)).toBe(true);
    expect(isPackageFeatured({}, 0)).toBe(false);
  });
});
