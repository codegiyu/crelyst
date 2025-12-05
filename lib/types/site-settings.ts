/**
 * Frontend types for Site Settings
 * These types match the backend ISiteSettings structure
 */

export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'tiktok',
  'whatsapp',
  'youtube',
  'x',
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface DayHours {
  start: string | null;
  end: string | null;
}

export interface OfficeHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface ContactInfo {
  address: string[];
  tel: string[];
  email: string[];
  whatsapp: string;
  locationUrl: string;
  officeHours: OfficeHours;
}

export interface Social {
  platform: SocialPlatform;
  href: string;
}

export interface AppDetails {
  logo: string;
  appName: string;
  description: string;
}

export interface SEODetails {
  metaTitleTemplate: string;
  metaDescription: string;
  keywords: string[];
  ogImageUrl: string;
  faviconUrl: string;
  canonicalUrlBase: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export interface LegalCompliance {
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
  cookiePolicyUrl: string;
  disclaimerText: string;
}

export interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
}

export interface FeatureFlags {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  loginEnabled: boolean;
}

export interface Analytics {
  googleAnalyticsId: string;
  facebookPixelId: string;
  otherTrackingIds: string[];
}

export interface Localization {
  defaultLanguage: string;
  supportedLanguages: string[];
  defaultTimezone: string;
  defaultCurrency: string;
}

export interface Branding {
  faviconUrl: string;
  primaryBrandColor: string;
  secondaryBrandColor: string;
}

export interface SiteSettings {
  _id: string;
  appDetails: AppDetails;
  seo: SEODetails;
  legal: LegalCompliance;
  email: EmailConfig;
  features: FeatureFlags;
  analytics: Analytics;
  localization: Localization;
  branding: Branding;
  contactInfo: ContactInfo;
  socials: Social[];
  createdAt: string;
  updatedAt: string;
}
