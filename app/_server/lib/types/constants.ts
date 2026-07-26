/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ProjectCaseStudy } from '@/lib/types/project-case-study';
import { JOB_TYPE } from './queues';

export interface IUser {
  _id: string;
  googleId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  avatar?: string;
  title?: string;
  accountStatus: AccountStatus;
  email: string;
  phoneNumber: string;
  gender?: Gender;
  auth: UserAuth;
  kyc: KYC;
  isDeleted?: boolean;
  deleteRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionApprovedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuth {
  password?: {
    value: string;
    passwordChangedAt?: Date;
  };
  roles: AuthUserRole[];
  lastLogin?: string;
  refreshTokenJTI?: string;
}

export interface AuthUserRole {
  roleId: string;
  slug: string;
}

export interface IAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  accountStatus: AccountStatus;
  auth: UserAuth;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRole {
  _id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  slug: string;
  name: string;
  description: string;
  isRestricted?: boolean;
}

export interface KYC {
  email: {
    isVerified: boolean;
    data: any;
  };
  phoneNumber: {
    isVerified: boolean;
    data: any;
  };
}

// Service Types

export interface IServiceExpertiseBreakdown {
  title: string;
  services: string[];
}

export interface IServiceExpertise {
  title: string;
  breakdown: IServiceExpertiseBreakdown[];
  highlightImage?: string;
  marqueeText?: string;
}

export interface IServiceUniqueGroup {
  title: string;
  text: string;
}

export interface IServiceWhatMakesUsUnique {
  title: string;
  groups: IServiceUniqueGroup[];
}

export interface IServiceMenu {
  image?: string;
  className?: string;
}

export interface IServicePackage {
  id: string;
  title?: string;
  summary?: string;
  priceRange: number[];
  benefits: string[];
  isFeatured?: boolean;
}

export interface IServicePackagePricing {
  id: string;
  title?: string;
  packages: IServicePackage[];
}

export interface IServicePricingFooter {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface IService {
  _id: string;
  title: string;
  slug: string;
  pageTitle?: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  cardImage?: string;
  bannerImage?: string;
  gallery?: string[];
  features: string[];
  expertise?: IServiceExpertise;
  breakdownSummary?: string[];
  whatMakesUsUnique?: IServiceWhatMakesUsUnique;
  menu?: IServiceMenu;
  packagePricing?: IServicePackagePricing[];
  pricingFooter?: IServicePricingFooter;
  process?: Array<{
    title: string;
    description: string;
    order: number;
  }>;
  benefits?: string[];
  pricing?: {
    startingPrice?: number;
    priceRange?: string;
    pricingModel?: 'fixed' | 'hourly' | 'project-based' | 'subscription' | 'custom';
    currency?: string;
    notes?: string;
  };
  duration?: {
    minWeeks?: number;
    maxWeeks?: number;
    typicalDuration?: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
    order: number;
  }>;
  additionalContent?: Array<{
    title: string;
    content: string;
    type?: 'text' | 'html' | 'markdown';
    order: number;
  }>;
  relatedServices?: string[];
  testimonials?: string[];
  caseStudies?: string[];
  tags?: string[];
  isActive: boolean;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalPath?: string;
    openGraph?: {
      title?: string;
      description?: string;
      type?: string;
      image?: string;
      siteName?: string;
      locale?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      image?: string;
    };
    robots?: {
      index?: boolean;
      follow?: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  featuredImage?: string;
  cardImage?: string;
  bannerImage?: string;
  /** Large hero image below the title block (case-study layout) */
  heroImage?: string;
  images: string[];
  /** Bold-brand-style case study sections; when set, public detail uses case-study layout */
  caseStudy?: ProjectCaseStudy;
  technologies: string[];
  category?: string;
  status: ProjectStatus;
  clientName?: string;
  clientWebsite?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate?: Date;
  endDate?: Date;
  challenge?: string;
  solution?: string;
  approach?: string;
  results?: string;
  metrics?: Array<{
    label: string;
    value: string;
    icon?: string;
    order: number;
  }>;
  timeline?: Array<{
    phase: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    status?: 'planned' | 'in-progress' | 'completed' | 'on-hold';
    order: number;
  }>;
  challengesFaced?: Array<{
    challenge: string;
    solution: string;
    order: number;
  }>;
  lessonsLearned?: string[];
  videoUrl?: string;
  additionalContent?: Array<{
    title: string;
    content: string;
    type?: 'text' | 'html' | 'markdown';
    order: number;
  }>;
  tags?: string[];
  budget?: {
    amount?: number;
    currency?: string;
    range?: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Testimonial Types
export interface ITestimonial {
  _id: string;
  clientName: string;
  clientRole?: string;
  companyName?: string;
  companyLogo?: string;
  clientImage?: string;
  testimonial: string;
  rating?: number; // 1-5 stars
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Brand Types (for marquee/logo display)
export interface IBrand {
  _id: string;
  name: string;
  logo: string;
  websiteUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// Team Member Types
export interface ITeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    /** @deprecated Use instagram instead. */
    github?: string;
    website?: string;
  };
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

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
  /** Google Maps embed iframe src for the public contact page */
  mapsEmbedUrl?: string;
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

export interface ProjectWorkflowStep {
  title: string;
  description: string;
  order: number;
}

export interface ProjectWorkflow {
  title: string;
  subtitle?: string;
  steps: ProjectWorkflowStep[];
}

export interface ISiteSettings {
  _id: string;
  name: string;
  appDetails: AppDetails;
  seo: SEODetails;
  legal: LegalCompliance;
  email: EmailConfig;
  features: FeatureFlags;
  analytics: Analytics;
  localization: Localization;
  branding: Branding;
  projectWorkflow?: ProjectWorkflow;
  contactInfo: ContactInfo;
  socials: Social[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: string;
  entityType: EntityType;
  entityId: string;
  intent: UploadIntent;
  filename: string;
  key: string;
  publicUrl: string;
  uploadUrl: string;
  fileExtension: string;
  contentType: string;
  status: DocumentStatus;
  uploadedAt?: Date;
  verifiedAt?: Date;
  expiresAt: Date;
  size?: number;
  metadata?: Record<string, unknown>;
  uploadedBy?: string;
  uploadedByModel?: 'Customer' | 'Admin';
  errorMessage?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailLog {
  _id: string;
  jobId: string; // Correlation id for this send attempt
  company: CompanyKey;
  type: JOB_TYPE;
  to: string; // Recipient email
  from: string; // Sender email
  subject: string;
  status: EmailStatus;
  messageId?: string; // Provider message ID (for webhook tracking)
  provider: string; // 'smtp', 'resend', etc.
  error?: string; // Error message if failed
  retryCount?: number; // Number of retry attempts
  htmlContent?: string; // HTML content of the email
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  metadata?: Record<string, any>;
  /** Denormalized for queries (hard / soft bounce). */
  bounceType?: 'hard' | 'soft';
  isDeleted?: boolean;
  deleteRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionApprovedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: string;
  actor: string;
  actorEmail?: string;
  action: AuditAction;
  resource: AuditLogResource;
  resourceId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: Date;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserActivityLog {
  _id: string;
  user: string;
  action: UserActivityAction;
  resource: UserActivityResource;
  resourceId?: string;
  performedBy: ActivitySource;
  description?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  performedAt: Date;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Subset of delivery states stored on notification documents (email pipeline). */
export type NotificationEmailDeliveryStatus = EmailStatus | 'queued' | 'skipped' | 'disabled';

export type NotificationEmailDelivery = {
  status: NotificationEmailDeliveryStatus;
  jobId?: string;
  lastAttemptAt?: Date;
  lastSentAt?: Date;
  lastError?: string;
  statusReason?: string;
};

export type NotificationStatus = 'active' | 'expired';

export type INotification = {
  _id: string;
  user: string;
  userModel: 'User' | 'Admin';
  eventType?: string;
  title?: string;
  message?: string;
  isRead: boolean;
  readAt: Date | null;
  status: NotificationStatus;
  expiredAt: Date | null;
  createdAt: Date;
  triggerDate: Date;
  expiresAt: Date;
  context?: Record<string, unknown>;
  emailDelivery: NotificationEmailDelivery;
};

export const COMPANY_KEYS = ['crelyst'] as const;
export type CompanyKey = (typeof COMPANY_KEYS)[number];

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

export type TOKEN_SCOPE = 'verify-email' | 'reset-password';
export type ACCESS_TYPES = 'client' | 'console';

export const USER_ROLES = ['customer', 'admin', 'super-admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const GENDERS = ['male', 'female', 'others'] as const;
export type Gender = (typeof GENDERS)[number];

export const ACCOUNT_STATUSES = [
  'unverified',
  'active',
  'suspended',
  'deleted',
  'blacklisted',
] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const DOCUMENT_STATUSES = ['pending', 'uploaded', 'verified', 'failed', 'expired'] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const EMAIL_STATUSES = [
  'pending',
  'sent',
  'delivered',
  'bounced',
  'failed',
  'opened',
  'clicked',
] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const UPLOAD_INTENTS = [
  'avatar',
  'logo',
  'card-image',
  'banner-image',
  'image',
  'other',
  'attachment',
] as const;
export type UploadIntent = (typeof UPLOAD_INTENTS)[number];

export const ENTITY_TYPES = [
  'user',
  'admin',
  'service',
  'project',
  'portfolio-case-study',
  'bbs-site-content',
  'testimonial',
  'brand',
  'team-member',
  'form-submission',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/** Entity types that support file uploads (presigned URL flow). Subset of ENTITY_TYPES. */
export const UPLOAD_ENTITY_TYPES: EntityType[] = [
  'user',
  'admin',
  'service',
  'project',
  'portfolio-case-study',
  'bbs-site-content',
  'testimonial',
  'brand',
  'form-submission',
];

/** Upload intents allowed for client (non-admin) users. */
export const ALLOWED_USER_UPLOAD_INTENTS: readonly UploadIntent[] = ['avatar', 'other'];

export const AUDIT_LOG_RESOURCES = [
  'admin',
  'user',
  'email-log',
  'document',
  'audit-log',
  'site-settings',
  'service',
  'project',
  'portfolio-case-study',
  'bbs-site-content',
  'testimonial',
  'brand',
] as const;
export type AuditLogResource = (typeof AUDIT_LOG_RESOURCES)[number];

export const AUDIT_ACTIONS = {
  ADMIN_INVITE: 'admin.invite',
  USER_CREATE: 'user.create',
  USER_PROFILE_UPDATE: 'user.profile.update',
  USER_PREFERENCES_UPDATE: 'user.preferences.update',
  USER_PASSWORD_UPDATE: 'user.password.update',
  USER_EMAIL_UPDATE: 'user.email.update',
  USER_PHONE_NUMBER_UPDATE: 'user.phone-number.update',
  USER_GENDER_UPDATE: 'user.gender.update',
  USER_ACCOUNT_STATUS_UPDATE: 'user.account-status.update',
  USER_KYC_UPDATE: 'user.kyc.update',
  USER_DELETE: 'user.delete',
  USER_RESTORE: 'user.restore',
} as const;
export const AUDIT_ACTION_VALUES = Object.values(AUDIT_ACTIONS);
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const USER_ACTIVITY_RESOURCES = [
  'customer',
  'business',
  'businessMembership',
  'wallet',
  'booking',
  'billboard',
] as const;
export type UserActivityResource = (typeof USER_ACTIVITY_RESOURCES)[number];

export const USER_ACTIVITY_ACTIONS = {
  USER_PROFILE_UPDATE: 'user.profile.update',
  USER_PREFERENCES_UPDATE: 'user.preferences.update',
  USER_PASSWORD_UPDATE: 'user.password.update',
  USER_EMAIL_UPDATE: 'user.email.update',
  USER_PHONE_NUMBER_UPDATE: 'user.phone-number.update',
  USER_GENDER_UPDATE: 'user.gender.update',
  USER_ACCOUNT_STATUS_UPDATE: 'user.account-status.update',
  USER_KYC_UPDATE: 'user.kyc.update',
  USER_DELETE: 'user.delete',
  USER_RESTORE: 'user.restore',
} as const;
export const USER_ACTIVITY_ACTION_VALUES = Object.values(USER_ACTIVITY_ACTIONS);
export type UserActivityAction = (typeof USER_ACTIVITY_ACTIONS)[keyof typeof USER_ACTIVITY_ACTIONS];

export type ActivitySource = 'self' | 'admin' | 'system';

// Project Types
export const PROJECT_STATUSES = [
  'draft',
  'in-progress',
  'completed',
  'on-hold',
  'cancelled',
  /** Legacy value still allowed in Firestore / imports from older API */
  'archived',
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

/** Legacy aliases — domain types without ORM document methods (Firestore uses plain objects). */
export type ModelUser = IUser;
export type ModelAdmin = IAdmin;
export type ModelRole = IRole;
export type ModelSiteSettings = ISiteSettings;
export type ModelService = IService;
export type ModelProject = IProject;
export type ModelTestimonial = ITestimonial;
export type ModelBrand = IBrand;
export type ModelTeamMember = ITeamMember;
export type ModelDocument = IDocument;
export type ModelEmailLog = IEmailLog;
export type ModelAuditLog = IAuditLog;
export type ModelUserActivityLog = IUserActivityLog;
export type ModelNotification = INotification;
