import { Admin } from '../../models/admin';
import { Role } from '../../models/role';
import { Service } from '../../models/service';
import { Project } from '../../models/project';
import { Testimonial } from '../../models/testimonial';
import { Brand } from '../../models/brand';
import { SiteSettings } from '../../models/siteSettings';
import { IAdmin, Permission } from '../types/constants';
import { AppError } from '../utils/appError';
import { createBcryptHash, generateRandomString, getRoleWithSlug } from '../utils/helpers';
import { logger } from '../utils/logger';
import { addToCache } from '../utils/redis';
import { ALL_ADMIN_PERMISSIONS, BASIC_ADMIN_PERMISSION_SLUGS } from '../types/contacts';
import { SERVICES_DATA, PROJECTS_DATA, TESTIMONIALS_DATA, BRANDS_DATA } from './seedData';

const SUPER_ADMIN_PERMISSIONS = ALL_ADMIN_PERMISSIONS;

const BASIC_ADMIN_PERMISSIONS = ALL_ADMIN_PERMISSIONS.filter((permission: Permission) =>
  BASIC_ADMIN_PERMISSION_SLUGS.includes(permission.slug as string)
);

export const ROLES_DATA = [
  {
    name: 'Super Admin',
    description: 'Super Admin Role',
    slug: 'super-admin',
    permissions: [...SUPER_ADMIN_PERMISSIONS],
  },
  {
    name: 'Admin',
    description: 'Admin Role',
    slug: 'admin',
    permissions: [...BASIC_ADMIN_PERMISSIONS],
  },
  {
    name: 'Customer',
    description: 'Customer Role',
    slug: 'customer',
    permissions: [],
  },
];

export const DEFAULT_SUPER_ADMIN: Omit<IAdmin, '_id' | 'auth' | 'createdAt' | 'updatedAt'> = {
  firstName: 'Super',
  lastName: 'Admin',
  email: 'codegiyu@gmail.com',
  accountStatus: 'active',
};

export const ROLE_SLUGS = ['super-admin', 'admin', 'customer'] as const;
export type RoleSlug = (typeof ROLE_SLUGS)[number];

export const seedRolesAndPermissions = async () => {
  for (const role of ROLES_DATA) {
    // Find existing role to check which fields exist
    const existingRole = await Role.findOne({ slug: role.slug });

    // Build update object with only missing fields
    const setFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {
      slug: role.slug,
    };

    if (!existingRole || existingRole.name === undefined || existingRole.name === null) {
      setFields.name = role.name;
    }
    if (
      !existingRole ||
      existingRole.description === undefined ||
      existingRole.description === null
    ) {
      setFields.description = role.description;
    }
    if (
      !existingRole ||
      existingRole.permissions === undefined ||
      existingRole.permissions === null ||
      existingRole.permissions.length === 0
    ) {
      setFields.permissions = (role.permissions || []).map(p => ({
        name: p.name,
        description: p.description,
        slug: p.slug,
        isRestricted: p.isRestricted,
      }));
    }

    const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
      $setOnInsert: setOnInsertFields,
    };
    if (Object.keys(setFields).length > 0) {
      updateObj.$set = setFields;
    }

    // create role if not exists
    const rawResult = await Role.findOneAndUpdate({ slug: role.slug }, updateObj, {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true, // validate against schema
      setDefaultsOnInsert: true, // apply schema defaults on insert
      context: 'query', // useful for some validators that need query context
    });

    if (!rawResult || !rawResult.value) continue;
    const createdRole = rawResult.value.toObject();

    logger.info(
      `${createdRole.slug} role ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
    addToCache(`pers:roleKeys:${role.slug}`, JSON.stringify(createdRole));
  }
};

export const seedSuperAdmin = async () => {
  const hashedPassword = await createBcryptHash('Password123');
  const JTI = generateRandomString(16, 'JTI');
  const superAdminRole = await getRoleWithSlug('super-admin');

  if (!superAdminRole) {
    throw new AppError('Error seeding super admin: Super Admin role not found', 500);
  }

  // Find existing admin to check which fields exist
  const existingAdmin = await Admin.findOne({ email: DEFAULT_SUPER_ADMIN.email });

  // Build update object with only missing fields
  const setFields: Record<string, unknown> = {};
  const setOnInsertFields: Record<string, unknown> = {
    firstName: DEFAULT_SUPER_ADMIN.firstName,
    lastName: DEFAULT_SUPER_ADMIN.lastName,
    email: DEFAULT_SUPER_ADMIN.email,
    accountStatus: DEFAULT_SUPER_ADMIN.accountStatus,
    'auth.password.value': hashedPassword,
  };

  if (!existingAdmin || !existingAdmin.auth?.refreshTokenJTI) {
    setFields['auth.refreshTokenJTI'] = JTI;
  }
  if (!existingAdmin || !existingAdmin.auth?.roles || existingAdmin.auth.roles.length === 0) {
    setFields['auth.roles'] = [{ roleId: superAdminRole._id, slug: superAdminRole.slug }];
  }
  if (
    !existingAdmin ||
    !existingAdmin.auth?.permissions ||
    existingAdmin.auth.permissions.length === 0
  ) {
    setFields['auth.permissions'] = (superAdminRole.permissions || []).map(permission => ({
      slug: permission.slug,
      name: permission.name,
      description: permission.description,
      isRestricted: permission.isRestricted,
    }));
  }
  if (!existingAdmin || !existingAdmin.auth?.lastLogin) {
    setFields['auth.lastLogin'] = new Date();
  }

  const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
    $setOnInsert: setOnInsertFields,
  };
  if (Object.keys(setFields).length > 0) {
    updateObj.$set = setFields;
  }

  // create superadmin if not exists
  const rawResult = await Admin.findOneAndUpdate({ email: DEFAULT_SUPER_ADMIN.email }, updateObj, {
    upsert: true,
    new: true,
    includeResultMetadata: true,
    runValidators: true, // validate against schema
    setDefaultsOnInsert: true, // apply schema defaults on insert
    context: 'query', // useful for some validators that need query context
  });

  if (!rawResult || !rawResult.value) {
    throw new AppError('Error seeding superAdmin: findOneAndUpdate failed!', 500);
  }

  // const superAdmin = rawResult.value.toObject();

  logger.info(
    `Super Admin account ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
  );
};

export const updateCacheToken = async () => {
  // if (ENVIRONMENT.APP.ENV === 'production') {
  //   const users = await Customer.find({
  //     email: { $in: administrators },
  //   });
  //   if (users.length !== administrators.length) return console.log('One or more users not found');
  //   for (const user of users) {
  //     let key: CacheKey = `pers:xxx`;
  //     switch (user.email) {
  //       case 'codegiyu@gmail.com':
  //         key = 'pers:dev:token' as CacheKey;
  //         break;
  //       default:
  //         console.log(`No cache key defined for ${user.email}`);
  //         continue;
  //     }
  //     await removeFromCache(key);
  //     await persistentRedis.set(key, user.auth.pushToken);
  //   }
  // }
};

// Helper function to check if a value is missing (undefined, null, or empty array/object)
const isFieldMissing = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
  return false;
};

// Seed functions
export const seedServices = async () => {
  for (const service of SERVICES_DATA) {
    // Find existing service to check which fields exist
    const existingService = await Service.findOne({ slug: service.slug });

    // Build update object with only missing fields
    const setFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {
      slug: service.slug,
    };

    const fieldsToCheck = [
      'title',
      'description',
      'shortDescription',
      'cardImage',
      'bannerImage',
      'features',
      'process',
      'benefits',
      'pricing',
      'duration',
      'videoUrl',
      'faq',
      'additionalContent',
      'relatedServices',
      'testimonials',
      'caseStudies',
      'tags',
      'isActive',
      'displayOrder',
      'seo',
    ];

    for (const field of fieldsToCheck) {
      const existingValue = existingService?.get(field);
      const seedValue = (service as Record<string, unknown>)[field];
      if (!existingService || isFieldMissing(existingValue)) {
        if (seedValue !== undefined && seedValue !== null) {
          setFields[field] = seedValue;
        }
      }
    }

    const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
      $setOnInsert: setOnInsertFields,
    };
    if (Object.keys(setFields).length > 0) {
      updateObj.$set = setFields;
    }

    const rawResult = await Service.findOneAndUpdate({ slug: service.slug }, updateObj, {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: 'query',
    });

    if (!rawResult || !rawResult.value) continue;
    const createdService = rawResult.value.toObject();

    logger.info(
      `Service "${createdService.title}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedProjects = async () => {
  for (const project of PROJECTS_DATA) {
    // Find existing project to check which fields exist
    const existingProject = await Project.findOne({ slug: project.slug });

    // Build update object with only missing fields
    const setFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {
      slug: project.slug,
    };

    const fieldsToCheck = [
      'title',
      'description',
      'shortDescription',
      'featuredImage',
      'cardImage',
      'bannerImage',
      'images',
      'technologies',
      'category',
      'status',
      'clientName',
      'clientWebsite',
      'projectUrl',
      'githubUrl',
      'startDate',
      'endDate',
      'challenge',
      'solution',
      'approach',
      'results',
      'metrics',
      'timeline',
      'teamMembers',
      'challengesFaced',
      'lessonsLearned',
      'videoUrl',
      'additionalContent',
      'relatedProjects',
      'testimonials',
      'tags',
      'budget',
      'isFeatured',
      'displayOrder',
      'seo',
    ];

    for (const field of fieldsToCheck) {
      const existingValue = existingProject?.get(field);
      const seedValue = (project as Record<string, unknown>)[field];
      if (!existingProject || isFieldMissing(existingValue)) {
        if (seedValue !== undefined && seedValue !== null) {
          setFields[field] = seedValue;
        }
      }
    }

    const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
      $setOnInsert: setOnInsertFields,
    };
    if (Object.keys(setFields).length > 0) {
      updateObj.$set = setFields;
    }

    const rawResult = await Project.findOneAndUpdate({ slug: project.slug }, updateObj, {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: 'query',
    });

    if (!rawResult || !rawResult.value) continue;
    const createdProject = rawResult.value.toObject();

    logger.info(
      `Project "${createdProject.title}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedTestimonials = async () => {
  for (const testimonial of TESTIMONIALS_DATA) {
    // Find existing testimonial to check which fields exist
    const existingTestimonial = await Testimonial.findOne({
      clientName: testimonial.clientName,
      companyName: testimonial.companyName,
    });

    // Build update object with only missing fields
    const setFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {
      clientName: testimonial.clientName,
      companyName: testimonial.companyName,
    };

    const fieldsToCheck = [
      'clientRole',
      'companyLogo',
      'clientImage',
      'testimonial',
      'rating',
      'isFeatured',
      'displayOrder',
      'projectId',
    ];

    for (const field of fieldsToCheck) {
      const existingValue = existingTestimonial?.get(field);
      const seedValue = (testimonial as Record<string, unknown>)[field];
      if (!existingTestimonial || isFieldMissing(existingValue)) {
        if (seedValue !== undefined && seedValue !== null) {
          setFields[field] = seedValue;
        }
      }
    }

    const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
      $setOnInsert: setOnInsertFields,
    };
    if (Object.keys(setFields).length > 0) {
      updateObj.$set = setFields;
    }

    const rawResult = await Testimonial.findOneAndUpdate(
      {
        clientName: testimonial.clientName,
        companyName: testimonial.companyName,
      },
      updateObj,
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        context: 'query',
      }
    );

    if (!rawResult || !rawResult.value) continue;
    const createdTestimonial = rawResult.value.toObject();

    logger.info(
      `Testimonial from "${createdTestimonial.clientName}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedBrands = async () => {
  for (const brand of BRANDS_DATA) {
    // Find existing brand to check which fields exist
    const existingBrand = await Brand.findOne({ name: brand.name });

    // Use placeholder logo if empty (required field)
    const logoUrl = brand.logo || 'https://via.placeholder.com/200x200?text=Logo';

    // Build update object with only missing fields
    const setFields: Record<string, unknown> = {};
    const setOnInsertFields: Record<string, unknown> = {
      name: brand.name,
    };

    // Check each field and only add if missing
    if (!existingBrand || isFieldMissing(existingBrand.websiteUrl)) {
      setFields.websiteUrl = brand.websiteUrl;
    }
    if (!existingBrand || isFieldMissing(existingBrand.isActive)) {
      setFields.isActive = brand.isActive;
    }
    if (!existingBrand || isFieldMissing(existingBrand.displayOrder)) {
      setFields.displayOrder = brand.displayOrder;
    }
    if (!existingBrand || isFieldMissing(existingBrand.logo)) {
      if (brand.logo) {
        setFields.logo = brand.logo;
      } else {
        setOnInsertFields.logo = logoUrl;
      }
    }

    const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
      $setOnInsert: setOnInsertFields,
    };
    if (Object.keys(setFields).length > 0) {
      updateObj.$set = setFields;
    }

    const rawResult = await Brand.findOneAndUpdate({ name: brand.name }, updateObj, {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: 'query',
    });

    if (!rawResult || !rawResult.value) continue;
    const createdBrand = rawResult.value.toObject();

    logger.info(
      `Brand "${createdBrand.name}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedSiteSettings = async () => {
  const defaultSettings = {
    name: 'settings',
    appDetails: {
      logo: '/images/logo.png',
      appName: 'Crelyst',
      description:
        'Crelyst is a full-service design and branding agency specializing in photography, brand design, product design, packaging, and visual identity. Where ideas take shape and colors speak.',
    },
    seo: {
      metaTitleTemplate: '%s | Crelyst',
      metaDescription:
        'Crelyst is a full-service design and branding agency specializing in photography, brand design, product design, packaging, and visual identity. Where ideas take shape and colors speak.',
      keywords: [
        'Crelyst',
        'Design Agency',
        'Branding',
        'Photography',
        'Product Design',
        'Packaging Design',
        'Visual Identity',
        'Creative Agency',
      ],
      ogImageUrl: '/og-image.png',
      faviconUrl: '/favicon.png',
      canonicalUrlBase: process.env.APP_URL || 'https://crelyst.com',
      robotsIndex: true,
      robotsFollow: true,
    },
    legal: {
      termsOfServiceUrl: '/legal/terms-of-service',
      privacyPolicyUrl: '/legal/privacy-policy',
      cookiePolicyUrl: '/legal/cookie-policy',
      disclaimerText: '',
    },
    email: {
      fromEmail: 'hello@crelyst.com',
      fromName: 'Crelyst',
      replyToEmail: 'hello@crelyst.com',
    },
    features: {
      maintenanceMode: false,
      registrationEnabled: true,
      loginEnabled: true,
    },
    analytics: {
      googleAnalyticsId: '',
      facebookPixelId: '',
      otherTrackingIds: [],
    },
    localization: {
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
      defaultTimezone: 'Africa/Lagos',
      defaultCurrency: 'NGN',
    },
    branding: {
      faviconUrl: '/favicon.png',
      primaryBrandColor: '#F27B35',
      secondaryBrandColor: '#404040',
    },
    contactInfo: {
      address: [],
      tel: [],
      email: ['hello@crelyst.com'],
      whatsapp: '',
      locationUrl: '',
      officeHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: null,
        sunday: null,
      },
    },
    socials: [],
  };

  // Find existing settings to check which fields exist
  const existingSettings = await SiteSettings.findOne({ name: 'settings' });

  // Build update object with only missing fields
  const setFields: Record<string, unknown> = {};
  const setOnInsertFields: Record<string, unknown> = {
    name: defaultSettings.name,
  };

  const topLevelFields = [
    'appDetails',
    'seo',
    'legal',
    'email',
    'features',
    'analytics',
    'localization',
    'branding',
    'contactInfo',
    'socials',
  ];

  for (const field of topLevelFields) {
    const existingValue = existingSettings?.get(field);
    const seedValue = (defaultSettings as Record<string, unknown>)[field];
    if (!existingSettings || isFieldMissing(existingValue)) {
      if (seedValue !== undefined && seedValue !== null) {
        setFields[field] = seedValue;
      }
    }
  }

  const updateObj: { $set?: Record<string, unknown>; $setOnInsert: Record<string, unknown> } = {
    $setOnInsert: setOnInsertFields,
  };
  if (Object.keys(setFields).length > 0) {
    updateObj.$set = setFields;
  }

  const rawResult = await SiteSettings.findOneAndUpdate({ name: 'settings' }, updateObj, {
    upsert: true,
    new: true,
    includeResultMetadata: true,
    runValidators: true,
    setDefaultsOnInsert: true,
    context: 'query',
  });

  if (!rawResult || !rawResult.value) {
    throw new AppError('Error seeding site settings: findOneAndUpdate failed!', 500);
  }

  logger.info(
    `Site settings ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
  );
};

// Seed database with initial data
export const seedDb = async () => {
  // Add seed functions here
  // await seedRolesAndPermissions();
  // await seedSuperAdmin();
  // await seedSiteSettings();
  // await seedServices();
  // await seedProjects();
  // await seedTestimonials();
  // await seedBrands();
};
