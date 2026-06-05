/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Firestore seed - seeds initial data to Firestore
 * Idempotent - safe to run multiple times
 */

import { Timestamp } from 'firebase-admin/firestore';
import { ENVIRONMENT } from '@/lib/config/environment';
import { adminAuth } from '@/lib/firebase/admin';
import { setDocument } from '@/lib/firebase/firestore';
import { logger } from '../utils/logger';
import {
  getSiteSettings,
  setSiteSettings,
  createBrand,
  updateBrand,
  getBrandByName,
  getServiceBySlug,
  createService,
  updateService,
  getProjectBySlug,
  createProject,
  updateProject,
  getTestimonialByClientAndCompany,
  createTestimonial,
  updateTestimonial,
  getTeamMemberByName,
  createTeamMember,
  updateTeamMember,
} from '../firestore/collections';
import {
  BRANDS_DATA,
  SERVICES_DATA,
  PROJECTS_DATA,
  TESTIMONIALS_DATA,
  TEAM_MEMBERS_DATA,
  ADMIN_SEED_DATA,
} from './seedData';

const DEFAULT_SITE_SETTINGS = {
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
    canonicalUrlBase: ENVIRONMENT.APP.APP_URL || 'https://crelyst.com',
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
    mapsEmbedUrl: '',
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

function normalizeTestimonialSeedPayload(
  testimonial: (typeof TESTIMONIALS_DATA)[number]
): Record<string, unknown> {
  const { projectId, ...rest } = testimonial as Record<string, unknown>;

  return {
    ...rest,
    isActive: (rest.isActive as boolean | undefined) ?? true,
    isFeatured: (rest.isFeatured as boolean | undefined) ?? false,
    displayOrder: (rest.displayOrder as number | undefined) ?? 0,
    clientRole: (rest.clientRole as string | undefined) ?? '',
    companyName: (rest.companyName as string | undefined) ?? '',
    companyLogo: (rest.companyLogo as string | undefined) ?? '',
    clientImage: (rest.clientImage as string | undefined) ?? '',
    rating: (rest.rating as number | undefined) ?? 5,
    ...(projectId != null && projectId !== '' ? { projectId } : {}),
  };
}

/** Idempotent upsert of testimonials from {@link TESTIMONIALS_DATA}. */
export async function seedTestimonials(): Promise<void> {
  for (const testimonial of TESTIMONIALS_DATA) {
    const clientName = testimonial.clientName;
    const companyName = testimonial.companyName;
    if (!clientName || !companyName) continue;

    const payload = normalizeTestimonialSeedPayload(testimonial);
    const existing = await getTestimonialByClientAndCompany(clientName, companyName);

    if (existing) {
      await updateTestimonial(existing.id, payload);
      logger.info(`Testimonial from "${clientName}" (${companyName}) updated`);
    } else {
      await createTestimonial(payload);
      logger.info(`Testimonial from "${clientName}" (${companyName}) created`);
    }
  }
}

export async function seedFirestore(): Promise<void> {
  try {
    // await seedTestimonials();
    // await setSiteSettings('settings', DEFAULT_SITE_SETTINGS);
    // logger.info('Site settings seeded');
    // // 2. Brands
    // for (const brand of BRANDS_DATA) {
    //   const existing = await getBrandByName(brand.name);
    //   const logoUrl = brand.logo || 'https://via.placeholder.com/200x200?text=Logo';
    //   const payload = {
    //     name: brand.name,
    //     logo: logoUrl,
    //     websiteUrl: brand.websiteUrl ?? '',
    //     isActive: brand.isActive ?? true,
    //     displayOrder: brand.displayOrder ?? 0,
    //   };
    //   if (existing) {
    //     await updateBrand(existing.id, payload);
    //     logger.info(`Brand "${brand.name}" updated`);
    //   } else {
    //     await createBrand(payload);
    //     logger.info(`Brand "${brand.name}" created`);
    //   }
    // }
    // // 3. Services
    // for (const service of SERVICES_DATA) {
    //   const slug = (service as { slug?: string }).slug;
    //   if (!slug) continue;
    //   const title = (service as { title?: string }).title ?? slug;
    //   const existing = await getServiceBySlug(slug);
    //   if (existing) {
    //     await updateService(existing.id, service as Record<string, unknown>);
    //     logger.info(`Service "${title}" updated`);
    //   } else {
    //     await createService(service as Record<string, unknown>);
    //     logger.info(`Service "${title}" created`);
    //   }
    // }
    // // 4. Projects
    // for (const project of PROJECTS_DATA) {
    //   const slug = (project as { slug?: string }).slug;
    //   if (!slug) continue;
    //   const title = (project as { title?: string }).title ?? slug;
    //   const existing = await getProjectBySlug(slug);
    //   if (existing) {
    //     await updateProject(existing.id, project as Record<string, unknown>);
    //     logger.info(`Project "${title}" updated`);
    //   } else {
    //     await createProject(project as Record<string, unknown>);
    //     logger.info(`Project "${title}" created`);
    //   }
    // }
    // // 5. Testimonials
    // for (const testimonial of TESTIMONIALS_DATA) {
    //   const clientName = (testimonial as { clientName?: string }).clientName;
    //   const companyName = (testimonial as { companyName?: string }).companyName;
    //   if (!clientName || !companyName) continue;
    //   const existing = await getTestimonialByClientAndCompany(clientName, companyName);
    //   if (existing) {
    //     await updateTestimonial(existing.id, testimonial as Record<string, unknown>);
    //     logger.info(`Testimonial from "${clientName}" (${companyName}) updated`);
    //   } else {
    //     await createTestimonial(testimonial as Record<string, unknown>);
    //     logger.info(`Testimonial from "${clientName}" (${companyName}) created`);
    //   }
    // }
    // // 6. Team members
    // for (const member of TEAM_MEMBERS_DATA) {
    //   const name = (member as { name?: string }).name;
    //   if (!name) continue;
    //   const payload = {
    //     ...member,
    //     bio: (member as { bio?: string }).bio ?? '',
    //     image: (member as { image?: string }).image ?? '',
    //     email: (member as { email?: string }).email ?? '',
    //     phone: (member as { phone?: string }).phone ?? '',
    //     socials: (member as { socials?: Record<string, string> }).socials ?? {},
    //   } as Record<string, unknown>;
    //   const existing = await getTeamMemberByName(name);
    //   if (existing) {
    //     await updateTeamMember(existing.id, payload);
    //     logger.info(`Team member "${name}" updated`);
    //   } else {
    //     await createTeamMember(payload);
    //     logger.info(`Team member "${name}" created`);
    //   }
    // }
    // 7. Admins (Firebase Auth + Firestore admins collection)
    // if (adminAuth) {
    //   const now = Timestamp.now();
    //   for (const adminData of ADMIN_SEED_DATA) {
    //     try {
    //       let user: { uid: string };
    //       try {
    //         user = await adminAuth.getUserByEmail(adminData.email);
    //         logger.info(`Admin ${adminData.email} already exists, ensuring Firestore profile`);
    //       } catch (err: unknown) {
    //         const code = (err as { code?: string })?.code;
    //         if (code !== 'auth/user-not-found') throw err;
    //         user = await adminAuth.createUser({
    //           email: adminData.email,
    //           password: adminData.password,
    //           displayName: adminData.displayName ?? adminData.email,
    //           emailVerified: true,
    //         });
    //         logger.info(`Admin user ${adminData.email} created in Auth`);
    //       }
    //       await setDocument('admins', user.uid, {
    //         id: user.uid,
    //         email: adminData.email,
    //         firstName: adminData.firstName,
    //         lastName: adminData.lastName,
    //         displayName: adminData.displayName,
    //         photoURL: adminData.photoURL,
    //         accountStatus: 'active',
    //         role: 'admin',
    //         createdAt: now,
    //         updatedAt: now,
    //       } as Record<string, unknown>);
    //     } catch (error) {
    //       logger.error(`Failed to seed admin ${adminData.email}:`, error);
    //       // Continue with other admins
    //     }
    //   }
    // } else {
    //   logger.warn('Firebase Admin Auth not initialized; skipping admin seed');
    // }
  } catch (error) {
    logger.error('Firestore seed error:', error);
    // Don't throw - allow server to start even if seed fails (e.g. missing Firebase config)
  }
}
