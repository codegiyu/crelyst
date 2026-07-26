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
import type { ProjectCaseStudy } from '@/lib/types/project-case-study';
import type { PortfolioCaseStudy } from '@/lib/types/portfolio-case-study';
import type { BbsSiteContent } from '@/lib/types/bbs-site-content';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Utility type that converts backend-oriented types to client-friendly types.
 * Converts Date, Firestore Timestamp, and MongoDB ObjectId to string; recurses into arrays and objects.
 */
export type ClientFriendly<T> = T extends Date
  ? string
  : T extends { toDate(): Date }
    ? string // Firestore Timestamp
    : T extends (infer U)[]
      ? ClientFriendly<U>[]
      : T extends readonly (infer U)[]
        ? readonly ClientFriendly<U>[]
        : T extends Record<string, any>
          ? { [K in keyof T]: ClientFriendly<T[K]> }
          : T;

// Client-friendly type aliases for backend types
export type ClientService = ClientFriendly<IService>;
export type ClientProject = ClientFriendly<IProject>;
export type ClientPortfolioCaseStudy = ClientFriendly<PortfolioCaseStudy>;
export type ClientBbsSiteContent = ClientFriendly<BbsSiteContent>;
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

  // Portfolio case studies — Bold Brand Studio (Public)
  LIST_PORTFOLIO_CASE_STUDIES: EndpointDefinition<
    undefined,
    IPortfolioCaseStudiesListRes,
    PageAndSizeQuery
  >;
  GET_PORTFOLIO_CASE_STUDY: EndpointDefinition<
    undefined,
    { caseStudy: ClientPortfolioCaseStudy },
    `/${string}`
  >;

  // Portfolio case studies (Admin)
  ADMIN_LIST_PORTFOLIO_CASE_STUDIES: EndpointDefinition<
    undefined,
    IPortfolioCaseStudiesListRes,
    PageAndSizeQuery
  >;
  ADMIN_CREATE_PORTFOLIO_CASE_STUDY: EndpointDefinition<
    IPortfolioCaseStudyCreatePayload,
    { caseStudy: ClientPortfolioCaseStudy },
    undefined
  >;
  ADMIN_GET_PORTFOLIO_CASE_STUDY: EndpointDefinition<
    undefined,
    { caseStudy: ClientPortfolioCaseStudy },
    `/${string}`
  >;
  ADMIN_UPDATE_PORTFOLIO_CASE_STUDY: EndpointDefinition<
    IPortfolioCaseStudyUpdatePayload,
    { caseStudy: ClientPortfolioCaseStudy },
    `/${string}`
  >;
  ADMIN_DELETE_PORTFOLIO_CASE_STUDY: EndpointDefinition<
    undefined,
    { success: boolean },
    `/${string}`
  >;
  ADMIN_REORDER_PORTFOLIO_CASE_STUDIES: EndpointDefinition<IReorderPayload, IReorderRes, undefined>;
  ADMIN_PUBLISH_PORTFOLIO_CASE_STUDIES: EndpointDefinition<
    undefined,
    { triggered: boolean; deploy?: unknown },
    undefined
  >;

  // Bold Brand Studio site content (Public)
  GET_BBS_SITE_CONTENT: EndpointDefinition<undefined, { content: ClientBbsSiteContent }, undefined>;

  // Bold Brand Studio site content (Admin)
  ADMIN_GET_BBS_SITE_CONTENT: EndpointDefinition<
    undefined,
    { content: ClientBbsSiteContent },
    undefined
  >;
  ADMIN_UPDATE_BBS_SITE_CONTENT: EndpointDefinition<
    IBbsSiteContentUpdatePayload,
    { content: ClientBbsSiteContent },
    undefined
  >;

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
  ADMIN_GET_SITE_SETTINGS: EndpointDefinition<
    undefined,
    ClientSiteSettings | Partial<ClientSiteSettings>,
    `/${string}`
  >;
  ADMIN_UPDATE_SITE_SETTINGS: EndpointDefinition<
    ISiteSettingsUpdatePayload,
    Partial<ClientSiteSettings>,
    undefined
  >;

  // Public lead forms
  PRESIGN_FORM_SUBMISSION_ATTACHMENTS: EndpointDefinition<
    IPresignFormSubmissionAttachmentsPayload,
    IPresignFormSubmissionAttachmentsRes,
    undefined
  >;
  SUBMIT_QUOTE_REQUEST: EndpointDefinition<IQuoteRequestPayload, { ok: boolean }, undefined>;
  SUBMIT_WORK_WITH_US: EndpointDefinition<IWorkWithUsPayload, { ok: boolean }, undefined>;

  // Form submissions (Admin inbox)
  ADMIN_LIST_FORM_SUBMISSIONS: EndpointDefinition<undefined, IFormSubmissionsListRes, `?${string}`>;
  ADMIN_PATCH_FORM_SUBMISSION: EndpointDefinition<
    { isRead?: boolean },
    { submission: ClientFormSubmission },
    `/${string}`
  >;
  ADMIN_FORM_SUBMISSION_UNREAD_COUNTS: EndpointDefinition<
    undefined,
    { quoteRequestUnread: number; workWithUsUnread: number },
    undefined
  >;
  ADMIN_MARK_ALL_FORM_SUBMISSIONS_READ: EndpointDefinition<
    { formType: FormSubmissionFormType },
    { modifiedCount: number },
    undefined
  >;
  ADMIN_DELETE_FORM_SUBMISSION: EndpointDefinition<undefined, { success: boolean }, `/${string}`>;

  ADMIN_LIST_AUDIT_LOGS: EndpointDefinition<undefined, IAuditLogsListRes, `?${string}`>;
  ADMIN_SEARCH: EndpointDefinition<undefined, IAdminSearchRes, `?${string}`>;
}

export const ENDPOINTS: Record<keyof AllEndpoints, EndpointDetails> = {
  // Authentication
  AUTH_LOGIN: {
    path: '/admin/auth/login',
    method: 'POST',
    isNotAuthenticated: true,
  },
  AUTH_LOGOUT: {
    path: '/admin/auth/logout',
    method: 'POST',
  },
  AUTH_SESSION: {
    path: '/admin/auth/session',
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

  LIST_PORTFOLIO_CASE_STUDIES: {
    path: '/public/portfolio-case-studies',
    method: 'GET',
    isNotAuthenticated: true,
  },
  GET_PORTFOLIO_CASE_STUDY: {
    path: '/public/portfolio-case-studies',
    method: 'GET',
    isNotAuthenticated: true,
  },

  ADMIN_LIST_PORTFOLIO_CASE_STUDIES: {
    path: '/admin/portfolio-case-studies',
    method: 'GET',
  },
  ADMIN_CREATE_PORTFOLIO_CASE_STUDY: {
    path: '/admin/portfolio-case-studies',
    method: 'POST',
  },
  ADMIN_GET_PORTFOLIO_CASE_STUDY: {
    path: '/admin/portfolio-case-studies',
    method: 'GET',
  },
  ADMIN_UPDATE_PORTFOLIO_CASE_STUDY: {
    path: '/admin/portfolio-case-studies',
    method: 'PATCH',
  },
  ADMIN_DELETE_PORTFOLIO_CASE_STUDY: {
    path: '/admin/portfolio-case-studies',
    method: 'DELETE',
  },
  ADMIN_REORDER_PORTFOLIO_CASE_STUDIES: {
    path: '/admin/portfolio-case-studies/reorder',
    method: 'PATCH',
  },
  ADMIN_PUBLISH_PORTFOLIO_CASE_STUDIES: {
    path: '/admin/portfolio-case-studies/publish',
    method: 'POST',
  },

  GET_BBS_SITE_CONTENT: {
    path: '/public/bbs-site-content',
    method: 'GET',
    isNotAuthenticated: true,
  },
  ADMIN_GET_BBS_SITE_CONTENT: {
    path: '/admin/bbs-site-content',
    method: 'GET',
  },
  ADMIN_UPDATE_BBS_SITE_CONTENT: {
    path: '/admin/bbs-site-content',
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
  ADMIN_GET_SITE_SETTINGS: {
    path: '/admin/site-settings', // /:slice
    method: 'GET',
  },
  ADMIN_UPDATE_SITE_SETTINGS: {
    path: '/admin/site-settings',
    method: 'PATCH',
  },

  PRESIGN_FORM_SUBMISSION_ATTACHMENTS: {
    path: '/public/form-submissions/presign',
    method: 'POST',
    isNotAuthenticated: true,
  },
  SUBMIT_QUOTE_REQUEST: {
    path: '/public/quote-request',
    method: 'POST',
    isNotAuthenticated: true,
  },
  SUBMIT_WORK_WITH_US: {
    path: '/public/work-with-us',
    method: 'POST',
    isNotAuthenticated: true,
  },

  ADMIN_LIST_FORM_SUBMISSIONS: {
    path: '/admin/form-submissions',
    method: 'GET',
  },
  ADMIN_PATCH_FORM_SUBMISSION: {
    path: '/admin/form-submissions',
    method: 'PATCH',
  },
  ADMIN_FORM_SUBMISSION_UNREAD_COUNTS: {
    path: '/admin/form-submissions/unread-counts',
    method: 'GET',
  },
  ADMIN_MARK_ALL_FORM_SUBMISSIONS_READ: {
    path: '/admin/form-submissions/mark-all-read',
    method: 'POST',
  },
  ADMIN_DELETE_FORM_SUBMISSION: {
    path: '/admin/form-submissions',
    method: 'DELETE',
  },

  ADMIN_LIST_AUDIT_LOGS: {
    path: '/admin/audit-logs',
    method: 'GET',
  },
  ADMIN_SEARCH: {
    path: '/admin/search',
    method: 'GET',
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
export type IPortfolioCaseStudiesListRes = GetListRes<ClientPortfolioCaseStudy, 'caseStudies'>;
export type IBrandsListRes = GetListRes<ClientBrand, 'brands'>;
export type ITestimonialsListRes = GetListRes<ClientTestimonial, 'testimonials'>;
export type ITeamMembersListRes = GetListRes<ClientTeamMember, 'teamMembers'>;

export type FormSubmissionFormType = 'quote-request' | 'work-with-us';

export type ClientFormSubmissionAttachment = {
  fileName: string;
  fileSize: number;
  contentType: string;
  key: string;
  publicUrl: string;
};

export interface ClientFormSubmission {
  _id: string;
  id?: string;
  formType: FormSubmissionFormType;
  isRead: boolean;
  name: string;
  email: string;
  message: string;
  company?: string;
  projectType?: string;
  budget?: string;
  portfolio?: string;
  experience?: string;
  uploadSessionId?: string;
  attachments?: ClientFormSubmissionAttachment[];
  sourceIp?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type IFormSubmissionsListRes = {
  submissions: ClientFormSubmission[];
  /** Submissions with isRead !== true (small inboxes: exact; large: indexed on isRead === false only). */
  unreadCount: number;
  nextCursor: string | null;
  hasMore: boolean;
  pagination: {
    total: number;
    limit: number;
  };
};

export type ClientAuditLogEntry = {
  _id: string;
  method: string;
  path: string;
  query: string;
  statusCode: number;
  actorId: string | null;
  actorEmail: string | null;
  clientIp: string | null;
  summary: string;
  searchText?: string;
  createdAt: string;
};

export type IAuditLogsListRes = {
  entries: ClientAuditLogEntry[];
  nextCursor: string | null;
  hasMore: boolean;
  searchActive: boolean;
  pagination: {
    /** Total rows when not searching; -1 when search is active (unknown total). */
    total: number;
    limit: number;
  };
};

export type IAdminSearchHit = {
  type: 'service' | 'project' | 'brand' | 'testimonial' | 'teamMember';
  id: string;
  title: string;
  slug?: string;
};

export type IAdminSearchRes = {
  query: string;
  services: IAdminSearchHit[];
  projects: IAdminSearchHit[];
  brands: IAdminSearchHit[];
  testimonials: IAdminSearchHit[];
  teamMembers: IAdminSearchHit[];
};

// Service Payloads
export interface IServiceCreatePayload {
  title: string;
  slug?: string;
  pageTitle?: string;
  description: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  cardImage?: string;
  bannerImage?: string;
  gallery?: string[];
  features?: string[];
  expertise?: IService['expertise'];
  breakdownSummary?: string[];
  whatMakesUsUnique?: IService['whatMakesUsUnique'];
  menu?: IService['menu'];
  packagePricing?: IService['packagePricing'];
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
  isActive?: boolean;
  displayOrder?: number;
  seo?: IService['seo'];
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
  heroImage?: string;
  images?: string[];
  caseStudy?: ProjectCaseStudy;
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
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export type IProjectUpdatePayload = Omit<Partial<IProjectCreatePayload>, 'caseStudy'> & {
  /** Pass `null` to remove case study from the document */
  caseStudy?: ProjectCaseStudy | null;
};

// Portfolio case study payloads (Bold Brand Studio)
export type IPortfolioCaseStudyCreatePayload = Partial<PortfolioCaseStudy> &
  Pick<PortfolioCaseStudy, 'title' | 'description' | 'category' | 'client' | 'industry'> & {
    slug?: string;
    image?: string;
    hero?: string;
    services?: string[];
    timeline?: string;
    summary?: PortfolioCaseStudy['summary'];
    challenge?: PortfolioCaseStudy['challenge'];
    strategy?: PortfolioCaseStudy['strategy'];
    identityImages?: string[];
    colorPalette?: PortfolioCaseStudy['colorPalette'];
    typographyPrimary?: string;
    typographySecondary?: string;
    results?: PortfolioCaseStudy['results'];
    keywords?: string[];
    isActive?: boolean;
    displayOrder?: number;
  };

export type IPortfolioCaseStudyUpdatePayload = Partial<IPortfolioCaseStudyCreatePayload>;

export interface IBbsSiteContentUpdatePayload {
  about?: ClientBbsSiteContent['about'];
  contact?: ClientBbsSiteContent['contact'];
  seo?: ClientBbsSiteContent['seo'];
  projectsListingSeo?: ClientBbsSiteContent['projectsListingSeo'];
}

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
    instagram?: string;
    /** @deprecated Use instagram instead. */
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
      | 'projectWorkflow'
      | 'aboutPage'
      | 'contactInfo'
      | 'socials';
    value: any; // The value structure depends on the slice name
  }>;
}

export type FormSubmissionAttachmentsPayload = {
  uploadSessionId?: string;
  attachments?: ClientFormSubmissionAttachment[];
};

export interface IPresignFormSubmissionAttachmentsPayload {
  formType: FormSubmissionFormType;
  uploadSessionId: string;
  files: Array<{
    fileName: string;
    fileSize: number;
    contentType: string;
  }>;
}

export interface IPresignFormSubmissionAttachmentsRes {
  uploadSessionId: string;
  uploads: Array<{
    uploadUrl: string;
    key: string;
    publicUrl: string;
    fileName: string;
    storedFileName: string;
  }>;
}

export interface IQuoteRequestPayload extends FormSubmissionAttachmentsPayload {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export interface IWorkWithUsPayload extends FormSubmissionAttachmentsPayload {
  name: string;
  email: string;
  portfolio: string;
  experience: string;
  message: string;
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
