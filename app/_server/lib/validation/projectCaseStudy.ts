import { z } from 'zod';

export const sectionHeadingSchema = z
  .object({
    headingTextStart: z.string().optional(),
    headingTextSpecial: z.string().optional(),
    headingTextEnd: z.string().optional(),
  })
  .optional();

export const caseStudyParagraphSchema = z.object({
  heading: z.string().optional(),
  inlineHeading: z.string().optional(),
  text: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  closing: z.string().optional(),
});

const paragraphSectionSchema = z.object({
  heading: sectionHeadingSchema,
  paragraphs: z.array(caseStudyParagraphSchema),
});

const logoSectionSchema = z.object({
  heading: sectionHeadingSchema,
  breakdown: z.array(caseStudyParagraphSchema),
  gridImage: z.string(),
});

const visualIdentitySchema = z.object({
  heading: sectionHeadingSchema,
  identityImages: z.array(z.string()),
  colorPalette: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
    })
  ),
  typographyPrimary: z.string(),
  typographySecondary: z.string(),
});

const applicationsSectionSchema = z.object({
  heading: sectionHeadingSchema,
  images: z.array(z.string()),
});

const resultsSectionSchema = z.object({
  heading: sectionHeadingSchema,
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
});

export const projectCaseStudySchema = z.object({
  industry: z.string(),
  services: z.array(z.string()),
  engagementTimeline: z.string(),
  aboutClient: paragraphSectionSchema.optional(),
  summary: paragraphSectionSchema,
  challenge: paragraphSectionSchema,
  strategy: paragraphSectionSchema,
  logoDesign: logoSectionSchema.optional(),
  visualIdentity: visualIdentitySchema,
  applications: applicationsSectionSchema.optional(),
  results: resultsSectionSchema,
  keywords: z.array(z.string()),
});

export type ProjectCaseStudyInput = z.infer<typeof projectCaseStudySchema>;
