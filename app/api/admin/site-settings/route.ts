import { updateSettings } from '@/app/_server/controllers/site/updateSettings';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateSettings);
