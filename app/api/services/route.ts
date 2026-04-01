import { listServices } from '@/app/_server/controllers/services/listServices';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { accessType: 'client' }, listServices('client'));
