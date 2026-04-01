import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { getBrandByName, updateBrand as updateBrandRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const updateBrandBodySchema = z.object({
  name: z.string().min(1).optional(),
  logo: z.string().optional(),
  websiteUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateBrand: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Brand identifier is required', 400);
  }

  const payload = validateBody(updateBrandBodySchema, body);

  if (payload.name && payload.name.trim().length > 0) {
    const existingBrand = await getBrandByName(payload.name);
    if (existingBrand && existingBrand.id !== identifier) {
      throw new AppError('Brand with this name already exists', 409);
    }
  }

  const updateData: Record<string, unknown> = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.logo !== undefined) updateData.logo = payload.logo;
  if (payload.websiteUrl !== undefined) updateData.websiteUrl = payload.websiteUrl;
  if (payload.isActive !== undefined) updateData.isActive = payload.isActive;
  if (payload.displayOrder !== undefined) updateData.displayOrder = payload.displayOrder;

  const brand = await updateBrandRepo(identifier, updateData);

  if (!brand) {
    throw new AppError('Brand not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(200, { brand: { ...brand, _id: brand.id } }, 'Brand updated successfully');
};
