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
    // create role if not exists
    const rawResult = await Role.findOneAndUpdate(
      { slug: role.slug },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: (role.permissions || []).map(p => ({
            name: p.name,
            description: p.description,
            slug: p.slug,
            isRestricted: p.isRestricted,
          })),
        },
        $setOnInsert: {
          slug: role.slug,
          // any fields you want initialized only on insert
        },
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
        runValidators: true, // validate against schema
        setDefaultsOnInsert: true, // apply schema defaults on insert
        context: 'query', // useful for some validators that need query context
      }
    );

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

  // create superadmin if not exists
  const rawResult = await Admin.findOneAndUpdate(
    { email: DEFAULT_SUPER_ADMIN.email },
    {
      $set: {
        'auth.refreshTokenJTI': JTI,
        'auth.roles': [{ roleId: superAdminRole._id, slug: superAdminRole.slug }],
        'auth.permissions': (superAdminRole.permissions || []).map(permission => ({
          slug: permission.slug,
          name: permission.name,
          description: permission.description,
          isRestricted: permission.isRestricted,
        })),
        'auth.lastLogin': new Date(),
      },
      $setOnInsert: {
        firstName: DEFAULT_SUPER_ADMIN.firstName,
        lastName: DEFAULT_SUPER_ADMIN.lastName,
        email: DEFAULT_SUPER_ADMIN.email,
        accountStatus: DEFAULT_SUPER_ADMIN.accountStatus,
        'auth.password.value': hashedPassword,
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true, // validate against schema
      setDefaultsOnInsert: true, // apply schema defaults on insert
      context: 'query', // useful for some validators that need query context
    }
  );

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

// Seed functions
export const seedServices = async () => {
  for (const service of SERVICES_DATA) {
    const rawResult = await Service.findOneAndUpdate(
      { slug: service.slug },
      {
        $set: {
          title: service.title,
          description: service.description,
          shortDescription: service.shortDescription,
          cardImage: service.cardImage,
          bannerImage: service.bannerImage,
          features: service.features,
          isActive: service.isActive,
          displayOrder: service.displayOrder,
          seo: service.seo,
        },
        $setOnInsert: {
          slug: service.slug,
        },
      },
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
    const createdService = rawResult.value.toObject();

    logger.info(
      `Service "${createdService.title}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedProjects = async () => {
  for (const project of PROJECTS_DATA) {
    const rawResult = await Project.findOneAndUpdate(
      { slug: project.slug },
      {
        $set: {
          title: project.title,
          description: project.description,
          shortDescription: project.shortDescription,
          featuredImage: project.featuredImage,
          cardImage: project.cardImage,
          bannerImage: project.bannerImage,
          images: project.images,
          technologies: project.technologies,
          category: project.category,
          status: project.status,
          clientName: project.clientName,
          clientWebsite: project.clientWebsite,
          projectUrl: project.projectUrl,
          githubUrl: project.githubUrl,
          startDate: project.startDate,
          endDate: project.endDate,
          isFeatured: project.isFeatured,
          displayOrder: project.displayOrder,
          seo: project.seo,
        },
        $setOnInsert: {
          slug: project.slug,
        },
      },
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
    const createdProject = rawResult.value.toObject();

    logger.info(
      `Project "${createdProject.title}" ${rawResult.lastErrorObject?.updatedExisting ? 'updated' : 'created'}`
    );
  }
};

export const seedTestimonials = async () => {
  for (const testimonial of TESTIMONIALS_DATA) {
    const rawResult = await Testimonial.findOneAndUpdate(
      {
        clientName: testimonial.clientName,
        companyName: testimonial.companyName,
      },
      {
        $set: {
          clientRole: testimonial.clientRole,
          companyLogo: testimonial.companyLogo,
          clientImage: testimonial.clientImage,
          testimonial: testimonial.testimonial,
          rating: testimonial.rating,
          isFeatured: testimonial.isFeatured,
          displayOrder: testimonial.displayOrder,
          projectId: testimonial.projectId,
        },
        $setOnInsert: {
          clientName: testimonial.clientName,
          companyName: testimonial.companyName,
        },
      },
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
    // Use placeholder logo if empty (required field)
    const logoUrl = brand.logo || 'https://via.placeholder.com/200x200?text=Logo';

    // Build update object conditionally to avoid conflict
    // If logo is provided, update it in $set; otherwise, set placeholder in $setOnInsert
    const updateObj: {
      $set: {
        websiteUrl: string;
        isActive: boolean;
        displayOrder: number;
        logo?: string;
      };
      $setOnInsert: {
        name: string;
        logo?: string;
      };
    } = {
      $set: {
        websiteUrl: brand.websiteUrl,
        isActive: brand.isActive,
        displayOrder: brand.displayOrder,
      },
      $setOnInsert: {
        name: brand.name,
      },
    };

    // Only set logo in $set if provided, otherwise set placeholder in $setOnInsert
    if (brand.logo) {
      updateObj.$set.logo = brand.logo;
    } else {
      updateObj.$setOnInsert.logo = logoUrl;
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

  const rawResult = await SiteSettings.findOneAndUpdate(
    { name: 'settings' },
    {
      $set: {
        appDetails: defaultSettings.appDetails,
        seo: defaultSettings.seo,
        legal: defaultSettings.legal,
        email: defaultSettings.email,
        features: defaultSettings.features,
        analytics: defaultSettings.analytics,
        localization: defaultSettings.localization,
        branding: defaultSettings.branding,
        contactInfo: defaultSettings.contactInfo,
        socials: defaultSettings.socials,
      },
      $setOnInsert: {
        name: defaultSettings.name,
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      context: 'query',
    }
  );

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
  await seedSiteSettings();
  // await seedServices();
  // await seedProjects();
  // await seedTestimonials();
  // await seedBrands();
};
