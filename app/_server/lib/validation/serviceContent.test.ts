import { describe, expect, it } from 'vitest';
import {
  serviceExtendedContentSchema,
  servicePackageSchema,
  serviceWriteBodySchema,
} from './serviceContent';

describe('servicePackageSchema', () => {
  it('rejects packages with an empty priceRange', () => {
    const result = servicePackageSchema.safeParse({
      id: 'basic',
      priceRange: [],
      benefits: ['Logo design'],
    });

    expect(result.success).toBe(false);
  });

  it('accepts a single-value priceRange', () => {
    const result = servicePackageSchema.safeParse({
      id: 'basic',
      priceRange: [500000],
      benefits: ['Logo design'],
    });

    expect(result.success).toBe(true);
  });
});

describe('serviceExtendedContentSchema', () => {
  it('accepts seeded-style expertise and FAQ blocks', () => {
    const result = serviceExtendedContentSchema.safeParse({
      pageTitle: 'We craft brand identities',
      expertise: {
        title: 'Define, differentiate & stand out',
        breakdown: [{ title: 'Visual identity', services: ['Logo Design'] }],
        marqueeText: 'Define, differentiate & stand out.',
      },
      faq: [{ question: 'How long?', answer: '2-4 weeks', order: 0 }],
    });

    expect(result.success).toBe(true);
  });
});

describe('serviceWriteBodySchema', () => {
  it('requires title and description', () => {
    expect(serviceWriteBodySchema.safeParse({ title: 'Brand Design' }).success).toBe(false);
  });
});
