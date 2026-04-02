import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBrandByName, createBrand as createBrandRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const createBrandBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  /** Empty on create when the client uploads the logo after the brand id exists */
  logo: z.string().optional(),
  websiteUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const createBrand: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createBrandBodySchema, body);

  const existingBrand = await getBrandByName(payload.name);
  if (existingBrand) {
    throw new AppError('Brand with this name already exists', 409);
  }

  const brand = await createBrandRepo({
    name: payload.name,
    logo: payload.logo ?? '',
    websiteUrl: payload.websiteUrl ?? '',
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? 0,
  });

  if (!brand) {
    throw new AppError('Failed to create brand', 500);
  }

  revalidateAboutAndHome();

  return sendResponse(201, { brand: { ...brand, _id: brand.id } }, 'Brand created successfully');
};
