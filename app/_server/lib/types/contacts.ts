import type { Permission } from './constants';

export const PERMISSION_SLUGS = {
  // Admin permissions
  ADMIN_LIST: 'admin:list',
  ADMIN_VIEW: 'admin:view',
  ADMIN_CREATE: 'admin:create',
  ADMIN_UPDATE: 'admin:update',
  ADMIN_DELETE: 'admin:delete',

  // User permissions
  USER_LIST: 'user:list',
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Site Settings permissions
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  // Service permissions
  SERVICE_LIST: 'service:list',
  SERVICE_VIEW: 'service:view',
  SERVICE_CREATE: 'service:create',
  SERVICE_UPDATE: 'service:update',
  SERVICE_DELETE: 'service:delete',

  // Project permissions
  PROJECT_LIST: 'project:list',
  PROJECT_VIEW: 'project:view',
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',

  // Testimonial permissions
  TESTIMONIAL_LIST: 'testimonial:list',
  TESTIMONIAL_VIEW: 'testimonial:view',
  TESTIMONIAL_CREATE: 'testimonial:create',
  TESTIMONIAL_UPDATE: 'testimonial:update',
  TESTIMONIAL_DELETE: 'testimonial:delete',

  // Brand permissions
  BRAND_LIST: 'brand:list',
  BRAND_VIEW: 'brand:view',
  BRAND_CREATE: 'brand:create',
  BRAND_UPDATE: 'brand:update',
  BRAND_DELETE: 'brand:delete',
} as const;

// Array of all admin permissions
export const ALL_ADMIN_PERMISSIONS: Permission[] = [
  // Admin permissions
  {
    slug: PERMISSION_SLUGS.ADMIN_LIST,
    name: 'List Admins',
    description: 'Permission to view list of all admins',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_VIEW,
    name: 'View Admin',
    description: 'Permission to view admin details',
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_CREATE,
    name: 'Create Admin',
    description: 'Permission to create new admin accounts',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_UPDATE,
    name: 'Update Admin',
    description: 'Permission to update admin information',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.ADMIN_DELETE,
    name: 'Delete Admin',
    description: 'Permission to delete admin accounts',
    isRestricted: true,
  },

  // User permissions
  {
    slug: PERMISSION_SLUGS.USER_LIST,
    name: 'List Users',
    description: 'Permission to view list of all users',
  },
  {
    slug: PERMISSION_SLUGS.USER_VIEW,
    name: 'View User',
    description: 'Permission to view user details',
  },
  {
    slug: PERMISSION_SLUGS.USER_CREATE,
    name: 'Create User',
    description: 'Permission to create new user accounts',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.USER_UPDATE,
    name: 'Update User',
    description: 'Permission to update user information',
    isRestricted: true,
  },
  {
    slug: PERMISSION_SLUGS.USER_DELETE,
    name: 'Delete User',
    description: 'Permission to delete user accounts',
    isRestricted: true,
  },

  // Site Settings permissions
  {
    slug: PERMISSION_SLUGS.SETTINGS_VIEW,
    name: 'View Settings',
    description: 'Permission to view site settings',
  },
  {
    slug: PERMISSION_SLUGS.SETTINGS_UPDATE,
    name: 'Update Settings',
    description: 'Permission to update site settings',
  },

  // Service permissions
  {
    slug: PERMISSION_SLUGS.SERVICE_LIST,
    name: 'List Services',
    description: 'Permission to view list of all services',
  },
  {
    slug: PERMISSION_SLUGS.SERVICE_VIEW,
    name: 'View Service',
    description: 'Permission to view service details',
  },
  {
    slug: PERMISSION_SLUGS.SERVICE_CREATE,
    name: 'Create Service',
    description: 'Permission to create new services',
  },
  {
    slug: PERMISSION_SLUGS.SERVICE_UPDATE,
    name: 'Update Service',
    description: 'Permission to update service information',
  },
  {
    slug: PERMISSION_SLUGS.SERVICE_DELETE,
    name: 'Delete Service',
    description: 'Permission to delete services',
    isRestricted: true,
  },

  // Project permissions
  {
    slug: PERMISSION_SLUGS.PROJECT_LIST,
    name: 'List Projects',
    description: 'Permission to view list of all projects',
  },
  {
    slug: PERMISSION_SLUGS.PROJECT_VIEW,
    name: 'View Project',
    description: 'Permission to view project details',
  },
  {
    slug: PERMISSION_SLUGS.PROJECT_CREATE,
    name: 'Create Project',
    description: 'Permission to create new projects',
  },
  {
    slug: PERMISSION_SLUGS.PROJECT_UPDATE,
    name: 'Update Project',
    description: 'Permission to update project information',
  },
  {
    slug: PERMISSION_SLUGS.PROJECT_DELETE,
    name: 'Delete Project',
    description: 'Permission to delete projects',
    isRestricted: true,
  },

  // Testimonial permissions
  {
    slug: PERMISSION_SLUGS.TESTIMONIAL_LIST,
    name: 'List Testimonials',
    description: 'Permission to view list of all testimonials',
  },
  {
    slug: PERMISSION_SLUGS.TESTIMONIAL_VIEW,
    name: 'View Testimonial',
    description: 'Permission to view testimonial details',
  },
  {
    slug: PERMISSION_SLUGS.TESTIMONIAL_CREATE,
    name: 'Create Testimonial',
    description: 'Permission to create new testimonials',
  },
  {
    slug: PERMISSION_SLUGS.TESTIMONIAL_UPDATE,
    name: 'Update Testimonial',
    description: 'Permission to update testimonial information',
  },
  {
    slug: PERMISSION_SLUGS.TESTIMONIAL_DELETE,
    name: 'Delete Testimonial',
    description: 'Permission to delete testimonials',
    isRestricted: true,
  },

  // Brand permissions
  {
    slug: PERMISSION_SLUGS.BRAND_LIST,
    name: 'List Brands',
    description: 'Permission to view list of all brands',
  },
  {
    slug: PERMISSION_SLUGS.BRAND_VIEW,
    name: 'View Brand',
    description: 'Permission to view brand details',
  },
  {
    slug: PERMISSION_SLUGS.BRAND_CREATE,
    name: 'Create Brand',
    description: 'Permission to create new brands',
  },
  {
    slug: PERMISSION_SLUGS.BRAND_UPDATE,
    name: 'Update Brand',
    description: 'Permission to update brand information',
  },
  {
    slug: PERMISSION_SLUGS.BRAND_DELETE,
    name: 'Delete Brand',
    description: 'Permission to delete brands',
    isRestricted: true,
  },
];

// Basic admin permission slugs (read-only and basic content management)
export const BASIC_ADMIN_PERMISSION_SLUGS: string[] = [
  // View permissions
  PERMISSION_SLUGS.ADMIN_VIEW,
  PERMISSION_SLUGS.USER_LIST,
  PERMISSION_SLUGS.USER_VIEW,
  PERMISSION_SLUGS.SETTINGS_VIEW,

  // Content management permissions
  PERMISSION_SLUGS.SERVICE_LIST,
  PERMISSION_SLUGS.SERVICE_VIEW,
  PERMISSION_SLUGS.SERVICE_CREATE,
  PERMISSION_SLUGS.SERVICE_UPDATE,

  PERMISSION_SLUGS.PROJECT_LIST,
  PERMISSION_SLUGS.PROJECT_VIEW,
  PERMISSION_SLUGS.PROJECT_CREATE,
  PERMISSION_SLUGS.PROJECT_UPDATE,

  PERMISSION_SLUGS.TESTIMONIAL_LIST,
  PERMISSION_SLUGS.TESTIMONIAL_VIEW,
  PERMISSION_SLUGS.TESTIMONIAL_CREATE,
  PERMISSION_SLUGS.TESTIMONIAL_UPDATE,

  PERMISSION_SLUGS.BRAND_LIST,
  PERMISSION_SLUGS.BRAND_VIEW,
  PERMISSION_SLUGS.BRAND_CREATE,
  PERMISSION_SLUGS.BRAND_UPDATE,
];
