import { fetchSettings } from '@/app/_server/controllers/site/fetchSettings';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { accessType: 'client' }, fetchSettings('client'));
