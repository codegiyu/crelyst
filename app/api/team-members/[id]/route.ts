import { getTeamMember } from '@/app/_server/controllers/team-members/getTeamMember';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { accessType: 'client' }, getTeamMember('client'));
