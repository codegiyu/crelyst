import { listServices } from '@/app/_server/controllers/services/listServices';
import { createService } from '@/app/_server/controllers/services/createService';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listServices('console'));
export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createService);
