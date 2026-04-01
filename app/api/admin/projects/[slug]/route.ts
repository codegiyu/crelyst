import { getProject } from '@/app/_server/controllers/projects/getProject';
import { updateProject } from '@/app/_server/controllers/projects/updateProject';
import { deleteProject } from '@/app/_server/controllers/projects/deleteProject';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getProject('console'));
export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateProject);
export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteProject);
