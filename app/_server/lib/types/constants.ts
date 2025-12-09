/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose, { Document } from 'mongoose';
import { JOB_TYPE } from './queues';

export interface IUser {
  _id: mongoose.Types.ObjectId;
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
  deletionApprovedBy?: mongoose.Types.ObjectId;
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
  _id: mongoose.Types.ObjectId;
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
  _id: mongoose.Types.ObjectId;
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
export interface IService {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  cardImage?: string;
  bannerImage?: string;
  features: string[];
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

export interface IProject {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  featuredImage?: string;
  cardImage?: string;
  bannerImage?: string;
  images: string[];
  technologies: string[];
  category?: string;
  status: ProjectStatus;
  clientName?: string;
  clientWebsite?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate?: Date;
  endDate?: Date;
  isFeatured: boolean;
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
  _id: mongoose.Types.ObjectId;
  clientName: string;
  clientRole?: string;
  companyName?: string;
  companyLogo?: string;
  clientImage?: string;
  testimonial: string;
  rating?: number; // 1-5 stars
  isFeatured: boolean;
  displayOrder: number;
  projectId?: mongoose.Types.ObjectId; // Optional reference to a project
  createdAt: Date;
  updatedAt: Date;
}

// Brand Types (for marquee/logo display)
export interface IBrand {
  _id: mongoose.Types.ObjectId;
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
  _id: mongoose.Types.ObjectId;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
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

export interface ISiteSettings {
  _id: mongoose.Types.ObjectId;
  name: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: mongoose.Types.ObjectId;
  entityType: EntityType;
  entityId: mongoose.Types.ObjectId;
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
  uploadedBy?: mongoose.Types.ObjectId;
  uploadedByModel?: 'Customer' | 'Admin';
  errorMessage?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailLog {
  _id: mongoose.Types.ObjectId;
  jobId: string; // BullMQ job ID
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
  isDeleted?: boolean;
  deleteRequestedAt?: Date;
  deletionApprovedAt?: Date;
  deletionApprovedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  actorEmail?: string;
  action: AuditAction;
  resource: AuditLogResource;
  resourceId?: mongoose.Types.ObjectId | string;
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
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  action: UserActivityAction;
  resource: UserActivityResource;
  resourceId?: mongoose.Types.ObjectId | string;
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

export type NotificationEmailDelivery = {
  status: EmailStatus;
  jobId?: string;
  lastAttemptAt?: Date;
  lastSentAt?: Date;
  lastError?: string;
  statusReason?: string;
};

export type NotificationStatus = 'active' | 'expired';

export type INotification = {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
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
] as const;
export type UploadIntent = (typeof UPLOAD_INTENTS)[number];

export const ENTITY_TYPES = [
  'user',
  'admin',
  'service',
  'project',
  'testimonial',
  'brand',
  'team-member',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const AUDIT_LOG_RESOURCES = [
  'admin',
  'user',
  'email-log',
  'document',
  'audit-log',
  'site-settings',
  'service',
  'project',
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
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface IModelIndex {
  find: any;
}

export type ModelUser = IUser & IModelIndex & Document;
export type ModelAdmin = IAdmin & IModelIndex & Document;
export type ModelRole = IRole & IModelIndex & Document;
export type ModelSiteSettings = ISiteSettings & IModelIndex & Document;
export type ModelService = IService & IModelIndex & Document;
export type ModelProject = IProject & IModelIndex & Document;
export type ModelTestimonial = ITestimonial & IModelIndex & Document;
export type ModelBrand = IBrand & IModelIndex & Document;
export type ModelTeamMember = ITeamMember & IModelIndex & Document;
export type ModelDocument = IDocument & IModelIndex & Document;
export type ModelEmailLog = IEmailLog & IModelIndex & Document;
export type ModelAuditLog = IAuditLog & IModelIndex & Document;
export type ModelUserActivityLog = IUserActivityLog & IModelIndex & Document;
export type ModelNotification = INotification & IModelIndex & Document;
