import { z } from 'zod';

export const sectionHeadingSchema = z
  .object({
    headingTextStart: z.string().optional(),
    headingTextSpecial: z.string().optional(),
    headingTextEnd: z.string().optional(),
  })
  .optional();

export const paragraphSchema = z.object({
  heading: z.string().optional(),
  inlineHeading: z.string().optional(),
  text: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  closing: z.string().optional(),
});

export const colorSwatchSchema = z.object({
  name: z.string(),
  hex: z.string(),
});

export const resultMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const logoDesignSchema = z.object({
  breakdown: z.array(paragraphSchema),
  gridImage: z.string().min(1),
});

/** Mirrors bold-brand-studio `Project` — ground truth for public + admin payloads. */
export const portfolioCaseStudyContentSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  hero: z.string(),
  industry: z.string(),
  client: z.string(),
  aboutClientHeading: sectionHeadingSchema,
  aboutClient: z.array(paragraphSchema).optional(),
  services: z.array(z.string()),
  timeline: z.string(),
  summary: z.array(paragraphSchema),
  challengeHeading: sectionHeadingSchema,
  challenge: z.array(paragraphSchema),
  strategyHeading: sectionHeadingSchema,
  strategy: z.array(paragraphSchema),
  logoDesignHeading: sectionHeadingSchema,
  logoDesign: logoDesignSchema.optional(),
  visualIdentityHeading: sectionHeadingSchema,
  identityImages: z.array(z.string()),
  applicationsHeading: sectionHeadingSchema,
  applicationsImages: z.array(z.string()).optional(),
  colorPalette: z.array(colorSwatchSchema),
  typographyPrimary: z.string(),
  typographySecondary: z.string(),
  resultsHeading: sectionHeadingSchema,
  results: z.array(resultMetricSchema),
  keywords: z.array(z.string()),
  seo: z
    .object({
      metaTitle: z.string().max(120).optional(),
      metaDescription: z.string().max(300).optional(),
      ogImageUrl: z.string().url().or(z.literal('')).optional(),
      keywords: z.array(z.string().max(80)).max(30).optional(),
    })
    .optional(),
  featured: z.boolean().optional(),
});

export const createPortfolioCaseStudyBodySchema = portfolioCaseStudyContentSchema
  .extend({
    isActive: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
  })
  .partial({ slug: true });

export const updatePortfolioCaseStudyBodySchema = portfolioCaseStudyContentSchema.partial().extend({
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export type PortfolioCaseStudyContentInput = z.infer<typeof portfolioCaseStudyContentSchema>;
export type CreatePortfolioCaseStudyBody = z.infer<typeof createPortfolioCaseStudyBodySchema>;
export type UpdatePortfolioCaseStudyBody = z.infer<typeof updatePortfolioCaseStudyBodySchema>;
