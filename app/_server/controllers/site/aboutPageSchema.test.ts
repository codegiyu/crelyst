import { describe, expect, it } from 'vitest';
import { aboutPageContentSchema, DEFAULT_ABOUT_PAGE_CONTENT } from './aboutPageSchema';

describe('aboutPageContentSchema', () => {
  it('accepts the default about page content', () => {
    expect(aboutPageContentSchema.safeParse(DEFAULT_ABOUT_PAGE_CONTENT).success).toBe(true);
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
