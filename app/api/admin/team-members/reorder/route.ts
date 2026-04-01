import { reorderTeamMembers } from '@/app/_server/controllers/team-members/reorderTeamMembers';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, reorderTeamMembers);
