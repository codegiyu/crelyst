import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getProjectBySlug,
  getProjectById,
  updateProject as updateProjectRepo,
} from '../../lib/firestore/collections';
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

const updateProjectBodySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
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
  caseStudy: projectCaseStudySchema.optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  seo: seoSchema.optional(),
});

export const updateProject: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Project identifier is required', 400);
  }

  const payload = validateBody(updateProjectBodySchema, body);

  let current = await getProjectBySlug(identifier);
  if (!current) current = await getProjectById(identifier);
  if (!current) {
    throw new AppError('Project not found', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = [
    'title',
    'description',
    'shortDescription',
    'featuredImage',
    'cardImage',
    'bannerImage',
    'heroImage',
    'images',
    'technologies',
    'tags',
    'category',
    'status',
    'clientName',
    'clientWebsite',
    'projectUrl',
    'githubUrl',
    'startDate',
    'endDate',
    'caseStudy',
    'isFeatured',
    'isActive',
    'displayOrder',
    'seo',
  ] as const;
  for (const f of fields) {
    const val = payload[f];
    if (val !== undefined) {
      if (f === 'caseStudy' && val === null) {
        updateData.caseStudy = null;
        continue;
      }
      updateData[f] =
        f === 'startDate' || f === 'endDate' ? (val ? new Date(val as string | number) : val) : val;
    }
  }

  const project = await updateProjectRepo(current.id, updateData);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  const updated = project as Record<string, unknown>;
  const slug = typeof updated.slug === 'string' ? updated.slug : identifier;
  revalidateProjectPublic(slug);

  return sendResponse(
    200,
    { project: { ...project, _id: project.id } },
    'Project updated successfully'
  );
};
