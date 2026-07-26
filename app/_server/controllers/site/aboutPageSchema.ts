import { z } from 'zod';
import { ABOUT_VALUE_ICON_KEYS, DEFAULT_ABOUT_PAGE_CONTENT } from '@/lib/types/about-page';

export const aboutCountStatSchema = z.object({
  kind: z.literal('count'),
  target: z.number().int().min(0).max(1_000_000),
  label: z.string().min(1).max(80),
});

export const aboutStaticStatSchema = z.object({
  kind: z.literal('static'),
  value: z.string().min(1).max(32),
  label: z.string().min(1).max(80),
});

export const aboutStatItemSchema = z.discriminatedUnion('kind', [
  aboutCountStatSchema,
  aboutStaticStatSchema,
]);

export const aboutPageContentSchema = z.object({
  hero: z.object({
    badge: z.string().min(1).max(80),
    titleLine1: z.string().min(1).max(120),
    titleLine2: z.string().min(1).max(120),
    description: z.string().min(1).max(2000),
  }),
  stats: z.array(aboutStatItemSchema).min(1).max(8),
  story: z.object({
    caption: z.string().min(1).max(80),
    title: z.string().min(1).max(120),
    subtitle: z.string().min(1).max(200),
    paragraphs: z.array(z.string().min(1).max(2000)).min(1).max(8),
    imageUrl: z.string().min(1).max(2000),
    imageAlt: z.string().min(1).max(200),
  }),
  values: z.object({
    caption: z.string().min(1).max(80),
    title: z.string().min(1).max(120),
    text: z.string().min(1).max(200),
    items: z
      .array(
        z.object({
          iconKey: z.enum(ABOUT_VALUE_ICON_KEYS),
          title: z.string().min(1).max(80),
          description: z.string().min(1).max(1000),
        })
      )
      .min(1)
      .max(8),
  }),
  cta: z.object({
    caption: z.string().min(1).max(80),
    title: z.string().min(1).max(160),
    description: z.string().min(1).max(1000),
    buttonLabel: z.string().min(1).max(80),
  }),
});

export { DEFAULT_ABOUT_PAGE_CONTENT };
