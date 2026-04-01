import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getTeamMemberById,
  updateTeamMember as updateTeamMemberRepo,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const updateTeamMemberBodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional(),
  image: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  socials: z.record(z.string(), z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const updateTeamMember: RouteHandler = async ({ request, body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const identifier = pathParts[pathParts.length - 1];

  if (!identifier) {
    throw new AppError('Team member identifier is required', 400);
  }

  const payload = validateBody(updateTeamMemberBodySchema, body);

  const current = await getTeamMemberById(identifier);
  if (!current) {
    throw new AppError('Team member not found', 404);
  }

  const updateData: Record<string, unknown> = {};
  const fields = [
    'name',
    'role',
    'bio',
    'image',
    'email',
    'phone',
    'socials',
    'isActive',
    'displayOrder',
  ] as const;
  for (const f of fields) {
    const val = payload[f];
    if (val !== undefined) updateData[f] = val;
  }

  const teamMember = await updateTeamMemberRepo(current.id, updateData);

  if (!teamMember) {
    throw new AppError('Team member not found', 404);
  }

  revalidateAboutAndHome();

  return sendResponse(
    200,
    { teamMember: { ...teamMember, _id: teamMember.id } },
    'Team member updated successfully'
  );
};
