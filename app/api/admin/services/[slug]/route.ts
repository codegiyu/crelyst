import { getService } from '@/app/_server/controllers/services/getService';
import { updateService } from '@/app/_server/controllers/services/updateService';
import { deleteService } from '@/app/_server/controllers/services/deleteService';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getService('console'));
export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateService);
export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteService);
