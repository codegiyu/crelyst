import { getTeamMember } from '@/app/_server/controllers/team-members/getTeamMember';
import { updateTeamMember } from '@/app/_server/controllers/team-members/updateTeamMember';
import { deleteTeamMember } from '@/app/_server/controllers/team-members/deleteTeamMember';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getTeamMember('console'));
export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateTeamMember);
export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteTeamMember);
