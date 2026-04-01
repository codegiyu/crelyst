import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { createTeamMember as createTeamMemberRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { revalidateAboutAndHome } from '../../lib/utils/revalidateSiteCache';

const createTeamMemberBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  bio: z.string().max(1000).optional(),
  image: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  socials: z.record(z.string(), z.string()).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export const createTeamMember: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const payload = validateBody(createTeamMemberBodySchema, body);

  const newTeamMember = await createTeamMemberRepo({
    name: payload.name,
    role: payload.role,
    bio: payload.bio ?? '',
    image: payload.image ?? '',
    email: payload.email ?? '',
    phone: payload.phone ?? '',
    socials: payload.socials ?? {},
    isActive: payload.isActive ?? true,
    displayOrder: payload.displayOrder ?? 0,
  });

  if (!newTeamMember) {
    throw new AppError('Failed to create team member', 500);
  }

  revalidateAboutAndHome();

  return sendResponse(
    201,
    { teamMember: { ...newTeamMember, _id: newTeamMember.id } },
    'Team member created successfully'
  );
};
