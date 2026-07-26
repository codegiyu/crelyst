import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getProjectBySlug,
  createProject as createProjectRepo,
  getNextDisplayOrder,
} from '../../lib/firestore/collections';
import { slugify } from '../../lib/utils/slugify';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { projectCaseStudySchema } from '../../lib/validation/projectCaseStudy';
import { projectStatusSchema } from '../../lib/validation/projectStatus';
import { revalidateProjectPublic } from '../../lib/utils/revalidateSiteCache';

const seoSchema = z.object({
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

const createProjectBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  cardImage: z.string().optional(),
  bannerImage: z.string().optional(),
  heroImage: z.string().optional(),
  images: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  status: projectStatusSchema.optional(),
  clientName: z.string().optional(),
  clientWebsite: z.string().optional(),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  startDate: z.union([z.string(), z.number()]).optional(),
  endDate: z.union([z.string(), z.number()]).optional(),
  caseStudy: projectCaseStudySchema.optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  seo: seoSchema.optional(),
});

export const createProject: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createProjectBodySchema, body);

  const finalSlug = (payload.slug && payload.slug.trim()) || slugify(payload.title);
  const existing = await getProjectBySlug(finalSlug);
  if (existing) {
    throw new AppError('Project with this slug already exists', 409);
  }

  const project = await createProjectRepo({
    title: payload.title,
    slug: finalSlug,
    description: payload.description,
    shortDescription: payload.shortDescription ?? '',
    featuredImage: payload.featuredImage ?? '',
    cardImage: payload.cardImage ?? '',
    bannerImage: payload.bannerImage ?? '',
    heroImage: payload.heroImage ?? '',
    images: payload.images ?? [],
    technologies: payload.technologies ?? [],
    tags: payload.tags ?? [],
    category: payload.category ?? '',
    status: payload.status ?? 'draft',
    clientName: payload.clientName ?? '',
    clientWebsite: payload.clientWebsite ?? '',
    projectUrl: payload.projectUrl ?? '',
    githubUrl: payload.githubUrl ?? '',
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    endDate: payload.endDate ? new Date(payload.endDate) : undefined,
    caseStudy: payload.caseStudy ?? undefined,
    isFeatured: payload.isFeatured ?? false,
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? (await getNextDisplayOrder('projects')),
    seo: payload.seo ?? {},
  });

  if (!project) {
    throw new AppError('Failed to create project', 500);
  }

  revalidateProjectPublic(finalSlug);

  return sendResponse(
    201,
    { project: { ...project, _id: project.id } },
    'Project created successfully'
  );
};
