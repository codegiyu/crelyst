import { describe, expect, it } from 'vitest';
import {
  bbsSiteContentSchema,
  DEFAULT_BBS_SITE_CONTENT,
  updateBbsSiteContentBodySchema,
} from './schema';

describe('bbsSiteContentSchema', () => {
  it('accepts the default seeded content shape including seo', () => {
    const result = bbsSiteContentSchema.safeParse(DEFAULT_BBS_SITE_CONTENT);
    expect(result.success).toBe(true);
    expect(DEFAULT_BBS_SITE_CONTENT.seo.metaTitle.length).toBeGreaterThan(0);
  });

  it('rejects empty about paragraphs', () => {
    const result = bbsSiteContentSchema.safeParse({
      ...DEFAULT_BBS_SITE_CONTENT,
      about: { ...DEFAULT_BBS_SITE_CONTENT.about, paragraphs: [] },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid contact email', () => {
    const result = bbsSiteContentSchema.safeParse({
      ...DEFAULT_BBS_SITE_CONTENT,
      contact: { ...DEFAULT_BBS_SITE_CONTENT.contact, email: 'not-an-email' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty seo metaTitle', () => {
    const result = bbsSiteContentSchema.safeParse({
      ...DEFAULT_BBS_SITE_CONTENT,
      seo: { ...DEFAULT_BBS_SITE_CONTENT.seo, metaTitle: '' },
    });
    expect(result.success).toBe(false);
  });
});

describe('updateBbsSiteContentBodySchema', () => {
  it('allows partial about-only updates', () => {
    const result = updateBbsSiteContentBodySchema.safeParse({
      about: DEFAULT_BBS_SITE_CONTENT.about,
    });
    expect(result.success).toBe(true);
  });

  it('allows seo-only updates', () => {
    const result = updateBbsSiteContentBodySchema.safeParse({
      seo: DEFAULT_BBS_SITE_CONTENT.seo,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty payload', () => {
    const result = updateBbsSiteContentBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
