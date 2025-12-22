/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IService,
  IProject,
  IBrand,
  ITestimonial,
  ITeamMember,
  ISiteSettings,
  IAdmin,
  UploadIntent,
  EntityType,
  ProjectStatus,
} from '@/app/_server/lib/types/constants';
import mongoose from 'mongoose';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility type that converts backend-oriented types to client-friendly types.
 * Converts:
 * - mongoose.Types.ObjectId -> string
 * - Date -> string
 * Recursively applies to nested objects and arrays.
 * Preserves optional (undefined) and null types appropriately.
 */
export type ClientFriendly<T> = T extends mongoose.Types.ObjectId
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? ClientFriendly<U>[]
      : T extends readonly (infer U)[]
        ? readonly ClientFriendly<U>[]
        : T extends Record<string, any>
          ? {
              [K in keyof T]: ClientFriendly<T[K]>;
            }
          : T;

// Client-friendly type aliases for backend types
export type ClientService = ClientFriendly<IService>;
export type ClientProject = ClientFriendly<IProject>;
export type ClientBrand = ClientFriendly<IBrand>;
export type ClientTestimonial = ClientFriendly<ITestimonial>;
export type ClientTeamMember = ClientFriendly<ITeamMember>;
export type ClientSiteSettings = ClientFriendly<ISiteSettings>;
export type ClientAdmin = ClientFriendly<IAdmin>;

export type EndpointDefinition<
  Payload extends Record<string, any> | undefined = undefined,
  Response = unknown,
  Query extends string | undefined = undefined,
> = Query extends undefined
  ? Payload extends undefined
    ? { payload?: never; query?: never; response: Response }
    : { payload: Payload; query?: never; response: Response }
  : Query extends `${string}` | undefined
    ? Payload extends undefined
      ? { payload?: never; query?: Query; response: Response }
      : { payload: Payload; query?: Query; response: Response }
    : Payload extends undefined
      ? { payload?: never; query: Query; response: Response }
      : { payload: Payload; query: Query; response: Response };

export type EndpointDetails = {
  path: `/${string}`;
  method: HttpMethods;
  isNotAuthenticated?: boolean;
};

export interface AllEndpoints {
  // Authentication
  AUTH_LOGIN: EndpointDefinition<IAuthLoginPayload, IAuthLoginRes, undefined>;
  AUTH_LOGOUT: EndpointDefinition<undefined, { success: boolean }, undefined>;
  AUTH_SESSION: EndpointDefinition<undefined, IAuthSessionRes, undefined>;

  // Service Management (Public)
  LIST_SERVICES: EndpointDefinition<undefined, IServicesListRes, PageAndSizeQuery>;
  GET_SERVICE: EndpointDefinition<undefined, { service: ClientService }, `/${string}`>;

  // Service Management (Admin)
  ADMIN_LIST_SERVICES: EndpointDefinition<undefined, IServicesListRes, PageAndSizeQuery>;
  ADMIN_CREATE_SERVICE: EndpointDefinition<
    IServiceCreatePayload,
    { service: ClientService },
    undefined
  >;
  ADMIN_GET_SERVICE: EndpointDefinition<undefined, { service: ClientService }, `/${string}`>;
  ADMIN_UPDATE_SERVICE: EndpointDefinition<
    IServiceUpdatePayload,
    { service: ClientService },
    `/${string}`
  >;
  ADMIN_DELETE_SERVICE: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_REORDER_SERVICES: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;

  // Project Management (Public)
  LIST_PROJECTS: EndpointDefinition<undefined, IProjectsListRes, PageAndSizeQuery>;
  GET_PROJECT: EndpointDefinition<undefined, { project: ClientProject }, `/${string}`>;

  // Project Management (Admin)
  ADMIN_LIST_PROJECTS: EndpointDefinition<undefined, IProjectsListRes, PageAndSizeQuery>;
  ADMIN_CREATE_PROJECT: EndpointDefinition<
    IProjectCreatePayload,
    { project: ClientProject },
    undefined
  >;
  ADMIN_GET_PROJECT: EndpointDefinition<undefined, { project: ClientProject }, `/${string}`>;
  ADMIN_UPDATE_PROJECT: EndpointDefinition<
    IProjectUpdatePayload,
    { project: ClientProject },
    `/${string}`
  >;
  ADMIN_DELETE_PROJECT: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_REORDER_PROJECTS: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;

  // Brand Management (Public)
  LIST_BRANDS: EndpointDefinition<undefined, IBrandsListRes, PageAndSizeQuery>;
  GET_BRAND: EndpointDefinition<undefined, { brand: ClientBrand }, `/${string}`>;

  // Brand Management (Admin)
  ADMIN_LIST_BRANDS: EndpointDefinition<undefined, IBrandsListRes, PageAndSizeQuery>;
  ADMIN_CREATE_BRAND: EndpointDefinition<IBrandCreatePayload, { brand: ClientBrand }, undefined>;
  ADMIN_GET_BRAND: EndpointDefinition<undefined, { brand: ClientBrand }, `/${string}`>;
  ADMIN_UPDATE_BRAND: EndpointDefinition<IBrandUpdatePayload, { brand: ClientBrand }, `/${string}`>;
  ADMIN_DELETE_BRAND: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_REORDER_BRANDS: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;

  // Testimonial Management (Public)
  LIST_TESTIMONIALS: EndpointDefinition<undefined, ITestimonialsListRes, PageAndSizeQuery>;
  GET_TESTIMONIAL: EndpointDefinition<undefined, { testimonial: ClientTestimonial }, `/${string}`>;

  // Testimonial Management (Admin)
  ADMIN_LIST_TESTIMONIALS: EndpointDefinition<undefined, ITestimonialsListRes, PageAndSizeQuery>;
  ADMIN_CREATE_TESTIMONIAL: EndpointDefinition<
    ITestimonialCreatePayload,
    { testimonial: ClientTestimonial },
    undefined
  >;
  ADMIN_GET_TESTIMONIAL: EndpointDefinition<
    undefined,
    { testimonial: ClientTestimonial },
    `/${string}`
  >;
  ADMIN_UPDATE_TESTIMONIAL: EndpointDefinition<
    ITestimonialUpdatePayload,
    { testimonial: ClientTestimonial },
    `/${string}`
  >;
  ADMIN_DELETE_TESTIMONIAL: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_REORDER_TESTIMONIALS: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;

  // Team Member Management (Public)
  LIST_TEAM_MEMBERS: EndpointDefinition<undefined, ITeamMembersListRes, PageAndSizeQuery>;
  GET_TEAM_MEMBER: EndpointDefinition<undefined, { teamMember: ClientTeamMember }, `/${string}`>;

  // Team Member Management (Admin)
  ADMIN_LIST_TEAM_MEMBERS: EndpointDefinition<undefined, ITeamMembersListRes, PageAndSizeQuery>;
  ADMIN_CREATE_TEAM_MEMBER: EndpointDefinition<
    ITeamMemberCreatePayload,
    { teamMember: ClientTeamMember },
    undefined
  >;
  ADMIN_GET_TEAM_MEMBER: EndpointDefinition<
    undefined,
    { teamMember: ClientTeamMember },
    `/${string}`
  >;
  ADMIN_UPDATE_TEAM_MEMBER: EndpointDefinition<
    ITeamMemberUpdatePayload,
    { teamMember: ClientTeamMember },
    `/${string}`
  >;
  ADMIN_DELETE_TEAM_MEMBER: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;
  ADMIN_REORDER_TEAM_MEMBERS: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: EndpointDefinition<
    IUploadPresignedUrlPayload,
    IUploadPresignedUrlRes,
    undefined
  >;

  // Site Settings (Public)
  GET_SITE_SETTINGS: EndpointDefinition<
    undefined,
    ClientSiteSettings | Partial<ClientSiteSettings>,
    `/${string}`
  >;

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: EndpointDefinition<
    ISiteSettingsUpdatePayload,
    Partial<ClientSiteSettings>,
    undefined
  >;
}

export const ENDPOINTS: Record<keyof AllEndpoints, EndpointDetails> = {
  // Authentication
  AUTH_LOGIN: {
    path: '/auth/login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_LOGOUT: {
    path: '/auth/logout',
    method: 'POST',
  },
  AUTH_SESSION: {
    path: '/auth/session',
    method: 'GET',
  },

  // Service Management (Public)
  LIST_SERVICES: {
    path: '/services',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_SERVICE: {
    path: '/services', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Service Management (Admin)
  ADMIN_LIST_SERVICES: {
    path: '/admin/services',
    method: 'GET',
  },
  ADMIN_CREATE_SERVICE: {
    path: '/admin/services',
    method: 'POST',
  },
  ADMIN_GET_SERVICE: {
    path: '/admin/services', // /:slug
    method: 'GET',
  },
  ADMIN_UPDATE_SERVICE: {
    path: '/admin/services', // /:slug
    method: 'PATCH',
  },
  ADMIN_DELETE_SERVICE: {
    path: '/admin/services', // /:slug
    method: 'DELETE',
  },
  ADMIN_REORDER_SERVICES: {
    path: '/admin/services/reorder',
    method: 'PATCH',
  },

  // Project Management (Public)
  LIST_PROJECTS: {
    path: '/projects',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_PROJECT: {
    path: '/projects', // /:slug
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Project Management (Admin)
  ADMIN_LIST_PROJECTS: {
    path: '/admin/projects',
    method: 'GET',
  },
  ADMIN_CREATE_PROJECT: {
    path: '/admin/projects',
    method: 'POST',
  },
  ADMIN_GET_PROJECT: {
    path: '/admin/projects', // /:slug
    method: 'GET',
  },
  ADMIN_UPDATE_PROJECT: {
    path: '/admin/projects', // /:slug
    method: 'PATCH',
  },
  ADMIN_DELETE_PROJECT: {
    path: '/admin/projects', // /:slug
    method: 'DELETE',
  },
  ADMIN_REORDER_PROJECTS: {
    path: '/admin/projects/reorder',
    method: 'PATCH',
  },

  // Brand Management (Public)
  LIST_BRANDS: {
    path: '/brands',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_BRAND: {
    path: '/brands', // /:id
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Brand Management (Admin)
  ADMIN_LIST_BRANDS: {
    path: '/admin/brands',
    method: 'GET',
  },
  ADMIN_CREATE_BRAND: {
    path: '/admin/brands',
    method: 'POST',
  },
  ADMIN_GET_BRAND: {
    path: '/admin/brands', // /:id
    method: 'GET',
  },
  ADMIN_UPDATE_BRAND: {
    path: '/admin/brands', // /:id
    method: 'PATCH',
  },
  ADMIN_DELETE_BRAND: {
    path: '/admin/brands', // /:id
    method: 'DELETE',
  },
  ADMIN_REORDER_BRANDS: {
    path: '/admin/brands/reorder',
    method: 'PATCH',
  },

  // Testimonial Management (Public)
  LIST_TESTIMONIALS: {
    path: '/testimonials',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_TESTIMONIAL: {
    path: '/testimonials', // /:id
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Testimonial Management (Admin)
  ADMIN_LIST_TESTIMONIALS: {
    path: '/admin/testimonials',
    method: 'GET',
  },
  ADMIN_CREATE_TESTIMONIAL: {
    path: '/admin/testimonials',
    method: 'POST',
  },
  ADMIN_GET_TESTIMONIAL: {
    path: '/admin/testimonials', // /:id
    method: 'GET',
  },
  ADMIN_UPDATE_TESTIMONIAL: {
    path: '/admin/testimonials', // /:id
    method: 'PATCH',
  },
  ADMIN_DELETE_TESTIMONIAL: {
    path: '/admin/testimonials', // /:id
    method: 'DELETE',
  },
  ADMIN_REORDER_TESTIMONIALS: {
    path: '/admin/testimonials/reorder',
    method: 'PATCH',
  },

  // Team Member Management (Public)
  LIST_TEAM_MEMBERS: {
    path: '/team-members',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_TEAM_MEMBER: {
    path: '/team-members', // /:id
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Team Member Management (Admin)
  ADMIN_LIST_TEAM_MEMBERS: {
    path: '/admin/team-members',
    method: 'GET',
  },
  ADMIN_CREATE_TEAM_MEMBER: {
    path: '/admin/team-members',
    method: 'POST',
  },
  ADMIN_GET_TEAM_MEMBER: {
    path: '/admin/team-members', // /:id
    method: 'GET',
  },
  ADMIN_UPDATE_TEAM_MEMBER: {
    path: '/admin/team-members', // /:id
    method: 'PATCH',
  },
  ADMIN_DELETE_TEAM_MEMBER: {
    path: '/admin/team-members', // /:id
    method: 'DELETE',
  },
  ADMIN_REORDER_TEAM_MEMBERS: {
    path: '/admin/team-members/reorder',
    method: 'PATCH',
  },

  // File Upload (Public)
  GENERATE_PRESIGNED_URL: {
    path: '/upload/presigned-url',
    method: 'POST',
    isNotAuthenticated: true,
  },

  // File Upload (Admin)
  ADMIN_GENERATE_PRESIGNED_URL: {
    path: '/admin/upload/presigned-url',
    method: 'POST',
  },

  // Site Settings (Public)
  GET_SITE_SETTINGS: {
    path: '/site-settings', // /:slice
    method: 'GET',
    isNotAuthenticated: true,
  },

  // Site Settings (Admin)
  ADMIN_UPDATE_SITE_SETTINGS: {
    path: '/admin/site-settings',
    method: 'PATCH',
  },
};

// Pagination Query Type
export type PageAndSizeQuery =
  | `?page=${number}&limit=${number}`
  | `?page=${number}`
  | `?limit=${number}`
  | `?${string}`;

// List Response Types
export type GetListRes<T, Name extends string> = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} & Record<Name, T[]>;

export type IServicesListRes = GetListRes<ClientService, 'services'>;
export type IProjectsListRes = GetListRes<ClientProject, 'projects'>;
export type IBrandsListRes = GetListRes<ClientBrand, 'brands'>;
export type ITestimonialsListRes = GetListRes<ClientTestimonial, 'testimonials'>;
export type ITeamMembersListRes = GetListRes<ClientTeamMember, 'teamMembers'>;

// Service Payloads
export interface IServiceCreatePayload {
  title: string;
  slug?: string; // Optional - auto-generated from title if not provided
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  cardImage?: string;
  bannerImage?: string;
  features?: string[];
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
  videoUrl?: string;
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
  isActive?: boolean;
  displayOrder?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type IServiceUpdatePayload = Partial<IServiceCreatePayload>;

// Reorder Payloads (generic for any entity with displayOrder)
export interface IReorderPayload {
  reorderItems: Array<{
    id: string;
    displayOrder: number;
  }>;
}

export interface IReorderRes {
  modifiedCount: number;
  matchedCount: number;
}

// Project Payloads
export interface IProjectCreatePayload {
  title: string;
  slug?: string; // Optional - auto-generated from title if not provided
  description: string;
  shortDescription?: string;
  featuredImage?: string;
  cardImage?: string;
  bannerImage?: string;
  images?: string[];
  technologies?: string[];
  category?: string;
  status?: ProjectStatus;
  clientName?: string;
  clientWebsite?: string;
  projectUrl?: string;
  githubUrl?: string;
  startDate?: string | Date;
  endDate?: string | Date;
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
    startDate?: string | Date;
    endDate?: string | Date;
    status?: 'planned' | 'in-progress' | 'completed' | 'on-hold';
    order: number;
  }>;
  teamMembers?: string[];
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
  relatedProjects?: string[];
  testimonials?: string[];
  tags?: string[];
  budget?: {
    amount?: number;
    currency?: string;
    range?: string;
  };
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type IProjectUpdatePayload = Partial<IProjectCreatePayload>;

// Brand Payloads
export interface IBrandCreatePayload {
  name: string;
  logo: string;
  websiteUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export type IBrandUpdatePayload = Partial<IBrandCreatePayload>;

// Testimonial Payloads
export interface ITestimonialCreatePayload {
  clientName: string;
  clientRole?: string;
  companyName?: string;
  companyLogo?: string;
  clientImage?: string;
  testimonial: string;
  rating?: number; // 1-5 stars
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  projectId?: string; // Optional reference to a project
}

export type ITestimonialUpdatePayload = Partial<ITestimonialCreatePayload>;

// Team Member Payloads
export interface ITeamMemberCreatePayload {
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
  isActive?: boolean;
  displayOrder?: number;
}

export type ITeamMemberUpdatePayload = Partial<ITeamMemberCreatePayload>;

// File Upload Payloads
export interface IUploadPresignedUrlPayloadBase {
  entityType?: EntityType;
  entityId?: string;
  intent?: UploadIntent;
  fileExtension?: string;
  contentType?: string;
  files?: Array<{
    fileExtension: string;
    contentType: string;
  }>;
}

export type IUploadPresignedUrlPayload =
  | (IUploadPresignedUrlPayloadBase & {
      // if single file, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      fileExtension: string;
      contentType: string;
      files?: never;
    })
  | (IUploadPresignedUrlPayloadBase & {
      // if multiple files, this is returned
      entityType: EntityType;
      entityId: string;
      intent: UploadIntent;
      files: Array<{
        fileExtension: string;
        contentType: string;
      }>;
      fileExtension?: never;
      contentType?: never;
    });

export interface IUploadPresignedUrlResBase {
  uploadUrl?: string;
  key?: string;
  intent?: string;
  publicUrl?: string;
  documentId?: string;
  filename?: string;
  expiresIn?: number;
  expiresAt?: string;
  uploads?: Array<{
    intent: string;
    uploadUrl: string;
    key: string;
    publicUrl: string;
    documentId?: string;
    filename?: string;
    expiresAt?: string;
    expiresIn: number;
  }>;
  count?: number;
}

export type IUploadPresignedUrlRes =
  | (IUploadPresignedUrlResBase & {
      // if single file, this is returned
      uploadUrl: string;
      key: string;
      filename?: string;
      expiresAt?: string;
      intent: string;
      publicUrl: string;
      documentId?: string;
      expiresIn: number;
      uploads?: never;
      count?: never;
    })
  | (IUploadPresignedUrlResBase & {
      // if multiple files, this is returned
      uploads: Array<{
        intent: string;
        uploadUrl: string;
        key: string;
        filename?: string;
        expiresAt?: string;
        publicUrl: string;
        documentId?: string;
        expiresIn: number;
      }>;
      count: number;
      uploadUrl?: never;
      key?: never;
      intent?: never;
      filename?: never;
      expiresAt?: never;
      publicUrl?: never;
      documentId?: never;
      expiresIn?: never;
    });

// Site Settings Payloads
export interface ISiteSettingsUpdatePayload {
  settingsPayload: Array<{
    name:
      | 'appDetails'
      | 'seo'
      | 'legal'
      | 'email'
      | 'features'
      | 'analytics'
      | 'localization'
      | 'branding'
      | 'contactInfo'
      | 'socials';
    value: any; // The value structure depends on the slice name
  }>;
}

// Authentication Payloads
export interface IAuthLoginPayload {
  email: string;
  password: string;
}

export interface IAuthLoginRes {
  admin: ClientAdmin;
}

export interface IAuthSessionRes {
  admin: ClientAdmin | null;
}
