import { listTeamMembers } from '@/app/_server/controllers/team-members/listTeamMembers';
import { createTeamMember } from '@/app/_server/controllers/team-members/createTeamMember';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listTeamMembers('console'));
export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createTeamMember);
