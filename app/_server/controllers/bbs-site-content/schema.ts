import { z } from 'zod';
import type { BbsSiteContent } from '@/lib/types/bbs-site-content';

export const bbsSocialPlatformSchema = z.enum([
  'instagram',
  'twitter',
  'x',
  'whatsapp',
  'linkedin',
  'facebook',
  'tiktok',
  'youtube',
]);

export const bbsAboutStatSchema = z.object({
  value: z.string().min(1).max(32),
  label: z.string().min(1).max(80),
});

export const bbsAboutContentSchema = z.object({
  eyebrow: z.string().min(1).max(80),
  headingLine1: z.string().min(1).max(120),
  headingHighlight: z.string().min(1).max(120),
  paragraphs: z.array(z.string().min(1).max(2000)).min(1).max(8),
  imageUrl: z.string().url().or(z.literal('')),
  imageAlt: z.string().min(1).max(200),
  stats: z.array(bbsAboutStatSchema).min(1).max(8),
});

export const bbsSocialLinkSchema = z.object({
  platform: bbsSocialPlatformSchema,
  href: z.string().url(),
});

export const bbsContactContentSchema = z.object({
  eyebrow: z.string().min(1).max(80),
  headingPrefix: z.string().min(1).max(120),
  headingHighlight: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  email: z.string().email(),
  socials: z.array(bbsSocialLinkSchema).max(12),
});

export const bbsSeoContentSchema = z.object({
  metaTitle: z.string().min(1).max(120),
  metaDescription: z.string().min(1).max(300),
  siteName: z.string().min(1).max(120),
  ogImageUrl: z.string().url().or(z.literal('')),
  faviconUrl: z.string().url().or(z.literal('')),
});

export const bbsProjectsListingSeoContentSchema = z.object({
  metaTitle: z.string().min(1).max(120),
  metaDescription: z.string().max(300),
  ogImageUrl: z.string().url().or(z.literal('')),
  keywords: z.array(z.string().min(1).max(80)).max(30),
});

export const bbsSiteContentSchema = z.object({
  about: bbsAboutContentSchema,
  contact: bbsContactContentSchema,
  seo: bbsSeoContentSchema,
  projectsListingSeo: bbsProjectsListingSeoContentSchema,
});

export const updateBbsSiteContentBodySchema = z
  .object({
    about: bbsAboutContentSchema.optional(),
    contact: bbsContactContentSchema.optional(),
    seo: bbsSeoContentSchema.optional(),
    projectsListingSeo: bbsProjectsListingSeoContentSchema.optional(),
  })
  .refine(
    data =>
      data.about !== undefined ||
      data.contact !== undefined ||
      data.seo !== undefined ||
      data.projectsListingSeo !== undefined,
    {
      message: 'At least one of about, contact, seo, or projectsListingSeo is required',
    }
  );

/** Current live Bold Brand Studio copy — seed/cutover source of truth. */
export const DEFAULT_BBS_SITE_CONTENT: BbsSiteContent = {
  about: {
    eyebrow: 'About',
    headingLine1: 'Strategy First.',
    headingHighlight: 'Design Second.',
    paragraphs: [
      "I'm Onoja Enemona Isaac — a strategic brand designer who builds identities that don't just look good, but work. Every logo, every packaging system, every brand touchpoint is engineered to create market leadership.",
      'I believe great design starts with deep strategy. Before a single pixel is placed, I dive into your market, your audience, and your competitive landscape to craft brands that command attention and build trust.',
    ],
    imageUrl: '',
    imageAlt: 'Onoja Enemona Isaac — Brand Designer',
    stats: [
      { value: '50+', label: 'Brands Built' },
      { value: '5+', label: 'Years Experience' },
      { value: '100%', label: 'Client Satisfaction' },
      { value: '4', label: 'Industries Served' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    headingPrefix: "Let's Build Something",
    headingHighlight: 'Bold.',
    description:
      "Have a project in mind? I'd love to hear about it. Let's create a brand that leads your industry.",
    email: 'enemonaisaaconoja@gmail.com',
    socials: [
      { platform: 'instagram', href: 'https://www.instagram.com/enemona.isaac' },
      { platform: 'x', href: 'https://x.com/enemonaisaaz' },
      { platform: 'whatsapp', href: 'https://wa.me/2349162045977' },
    ],
  },
  seo: {
    metaTitle: "Enemona Isaac's Design Portfolio",
    metaDescription:
      'Discover the design portfolio of Enemona Isaac, a product designer and digital experience creator.',
    siteName: 'Enemona Isaac',
    ogImageUrl: '',
    faviconUrl: '',
  },
  projectsListingSeo: {
    metaTitle: "Projects | Enemona Isaac's Design Portfolio",
    metaDescription: '',
    ogImageUrl: '',
    keywords: [],
  },
};

export function mergeBbsSiteContent(
  doc: Record<string, unknown> | null | undefined,
  overrides: Partial<BbsSiteContent> = {}
): BbsSiteContent {
  return {
    about: (overrides.about ??
      doc?.about ??
      DEFAULT_BBS_SITE_CONTENT.about) as BbsSiteContent['about'],
    contact: (overrides.contact ??
      doc?.contact ??
      DEFAULT_BBS_SITE_CONTENT.contact) as BbsSiteContent['contact'],
    seo: (overrides.seo ?? doc?.seo ?? DEFAULT_BBS_SITE_CONTENT.seo) as BbsSiteContent['seo'],
    projectsListingSeo: (overrides.projectsListingSeo ??
      doc?.projectsListingSeo ??
      DEFAULT_BBS_SITE_CONTENT.projectsListingSeo) as BbsSiteContent['projectsListingSeo'],
  };
}
