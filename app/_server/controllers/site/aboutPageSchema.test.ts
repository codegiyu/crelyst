import { describe, expect, it } from 'vitest';
import { aboutPageContentSchema, DEFAULT_ABOUT_PAGE_CONTENT } from './aboutPageSchema';

describe('aboutPageContentSchema', () => {
  it('accepts the default about page content without hero backgroundImage', () => {
    expect(aboutPageContentSchema.safeParse(DEFAULT_ABOUT_PAGE_CONTENT).success).toBe(true);
    expect('backgroundImage' in DEFAULT_ABOUT_PAGE_CONTENT.hero).toBe(false);
  });

  it('rejects empty story.imageUrl', () => {
    const result = aboutPageContentSchema.safeParse({
      ...DEFAULT_ABOUT_PAGE_CONTENT,
      story: { ...DEFAULT_ABOUT_PAGE_CONTENT.story, imageUrl: '' },
    });
    expect(result.success).toBe(false);
  });

  it('strips legacy hero.backgroundImage from stored payloads', () => {
    const result = aboutPageContentSchema.safeParse({
      ...DEFAULT_ABOUT_PAGE_CONTENT,
      hero: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.hero,
        backgroundImage: '/images/bg-hero-3.jpg',
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('backgroundImage' in result.data.hero).toBe(false);
    }
  });

  it('rejects values items with unknown icon keys', () => {
    const result = aboutPageContentSchema.safeParse({
      ...DEFAULT_ABOUT_PAGE_CONTENT,
      values: {
        ...DEFAULT_ABOUT_PAGE_CONTENT.values,
        items: [
          {
            iconKey: 'rocket',
            title: 'Bad',
            description: 'Invalid icon',
          },
        ],
      },
    });
    expect(result.success).toBe(false);
  });
});
