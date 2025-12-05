import { z } from 'zod';

// Reusable schemas
const seoSchema = z.object({
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

const socialSchema = z.object({
  platform: z.string(),
  href: z.string().url('Invalid social URL'),
});

export const mainSchema = z.object({
  // ===== Auth / User fields =====
  firstName: z
    .string()
    .min(2, { error: 'First name cannot be empty!' })
    .max(50, { error: 'First name is too long!' }),
  lastName: z
    .string()
    .min(2, { error: 'Last name cannot be empty!' })
    .max(50, { error: 'Last name is too long!' }),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format (must be in E.164 format)'),
  email: z.email({ error: 'Please enter a valid email address!' }).max(100, 'Email is too long!'),
  password: z
    .string({ error: 'Please enter your password' })
    .min(8, { error: 'Password must be at least 8 characters' }),
  currentPassword: z
    .string({ error: 'Please enter your password' })
    .min(8, { error: 'Password must be at least 8 characters' }),
  confirmPassword: z
    .string({ error: 'Please enter your password' })
    .min(8, { error: 'Password must be at least 8 characters' }),
  code: z.string().min(6, 'Code must be 6 characters!').max(6, 'Code must be 6 characters!'),
  scope: z.string(),
  scopeToken: z.string(),

  // ===== Common entity fields =====
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  // slug: z.string().max(250, 'Slug is too long'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().max(500, 'Short description is too long'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  displayOrder: z.number().int().min(0),

  // ===== Image fields =====
  image: z.string().url('Invalid image URL'),
  logo: z.string().url('Invalid logo URL'),
  icon: z.string(),
  cardImage: z.string().url('Invalid card image URL'),
  bannerImage: z.string().url('Invalid banner image URL'),
  featuredImage: z.string().url('Invalid featured image URL'),
  images: z.array(z.string().url('Invalid image URL')),
  clientImage: z.string().url('Invalid client image URL'),
  companyLogo: z.string().url('Invalid company logo URL'),

  // ===== Service fields =====
  features: z.array(z.string()),
  seo: seoSchema,

  // ===== Project fields =====
  technologies: z.array(z.string()),
  category: z.string().max(100),
  status: z.enum(['draft', 'in-progress', 'completed', 'archived']),
  clientName: z.string().max(100),
  clientWebsite: z.string().url('Invalid client website URL'),
  projectUrl: z.string().url('Invalid project URL'),
  githubUrl: z.string().url('Invalid GitHub URL'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),

  // ===== Brand fields =====
  websiteUrl: z.string().url('Invalid website URL'),

  // ===== Testimonial fields =====
  clientRole: z.string().max(100),
  companyName: z.string().max(100),
  testimonial: z.string().min(1, 'Testimonial is required'),
  rating: z.number().int().min(1).max(5),
  projectId: z.string(),

  // ===== Team Member fields =====
  role: z.string().min(1, 'Role is required').max(100),
  bio: z.string().max(1000, 'Bio is too long'),
  phone: z.string(),
  socials: z.array(socialSchema).or(z.record(z.string(), z.string())),

  // ===== Upload / Presigned URL fields =====
  entityType: z.enum([
    'user',
    'admin',
    'service',
    'project',
    'testimonial',
    'brand',
    'team-member',
  ]),
  entityId: z.string(),
  intent: z.enum(['avatar', 'logo', 'card-image', 'banner-image', 'image', 'other']),
  fileExtension: z.string(),
  contentType: z.string(),
  files: z.array(
    z.object({
      fileExtension: z.string(),
      contentType: z.string(),
    })
  ),

  // ===== Webhook fields =====
  documentId: z.string(),
  key: z.string(),

  // ===== Reorder fields =====
  reorderItems: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(0),
    })
  ),

  // ===== Settings =====
  settingsPayload: z.array(
    z.object({
      name: z.string().min(1, 'Setting slice name is required!'),
      value: z.record(z.string(), z.any(), { error: 'Setting value must be a valid object!' }),
    })
  ),
});

export const partialMainSchema = mainSchema.partial();
