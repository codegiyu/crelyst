import { z } from 'zod';

export const serviceExpertiseBreakdownSchema = z.object({
  title: z.string().min(1),
  services: z.array(z.string()),
});

export const serviceExpertiseSchema = z.object({
  title: z.string().min(1),
  breakdown: z.array(serviceExpertiseBreakdownSchema),
  highlightImage: z.string().optional(),
  marqueeText: z.string().optional(),
});

export const serviceUniqueGroupSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export const serviceWhatMakesUsUniqueSchema = z.object({
  title: z.string().min(1),
  groups: z.array(serviceUniqueGroupSchema),
});

export const serviceProcessStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().min(0),
});

export const servicePackageSchema = z.object({
  id: z.string().min(1),
  priceRange: z.array(z.number()).min(1),
  benefits: z.array(z.string()),
});

export const servicePackagePricingSchema = z.object({
  id: z.string().min(1),
  packages: z.array(servicePackageSchema),
});

export const serviceFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().int().min(0),
});

export const serviceSeoSchema = z.object({
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

export const serviceExtendedContentSchema = z.object({
  pageTitle: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  expertise: serviceExpertiseSchema.optional(),
  breakdownSummary: z.array(z.string()).optional(),
  whatMakesUsUnique: serviceWhatMakesUsUniqueSchema.optional(),
  process: z.array(serviceProcessStepSchema).optional(),
  benefits: z.array(z.string()).optional(),
  packagePricing: z.array(servicePackagePricingSchema).optional(),
  faq: z.array(serviceFaqSchema).optional(),
  tags: z.array(z.string()).optional(),
});

export const serviceWriteBodySchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required').optional(),
    description: z.string().min(1, 'Description is required'),
    shortDescription: z.string().optional(),
    icon: z.string().optional(),
    image: z.string().optional(),
    cardImage: z.string().optional(),
    bannerImage: z.string().optional(),
    features: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    displayOrder: z.number().int().min(0).optional(),
    seo: serviceSeoSchema.optional(),
  })
  .merge(serviceExtendedContentSchema);

export const serviceUpdateBodySchema = serviceWriteBodySchema
  .omit({ title: true, slug: true, description: true })
  .partial()
  .extend({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
  });

export type ServiceExtendedContent = z.infer<typeof serviceExtendedContentSchema>;
