import { listProjects } from '@/app/_server/controllers/projects/listProjects';
import { createProject } from '@/app/_server/controllers/projects/createProject';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listProjects('console'));
export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createProject);
