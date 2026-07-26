/**
 * Bold Brand Studio site content (about + contact + SEO) managed from Crelyst admin.
 * Separate from Crelyst company siteSettings.
 */

export type BbsSocialPlatform =
  | 'instagram'
  | 'twitter'
  | 'x'
  | 'whatsapp'
  | 'linkedin'
  | 'facebook'
  | 'tiktok'
  | 'youtube';

export interface BbsAboutStat {
  value: string;
  label: string;
}

export interface BbsAboutContent {
  eyebrow: string;
  headingLine1: string;
  headingHighlight: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  stats: BbsAboutStat[];
}

export interface BbsSocialLink {
  platform: BbsSocialPlatform;
  href: string;
}

export interface BbsContactContent {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  description: string;
  email: string;
  socials: BbsSocialLink[];
}

export interface BbsSeoContent {
  metaTitle: string;
  metaDescription: string;
  siteName: string;
  ogImageUrl: string;
  faviconUrl: string;
}

export interface BbsProjectsListingSeoContent {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords: string[];
}

export interface BbsSiteContent {
  about: BbsAboutContent;
  contact: BbsContactContent;
  seo: BbsSeoContent;
  projectsListingSeo: BbsProjectsListingSeoContent;
  createdAt?: string;
  updatedAt?: string;
}
