import { getBbsSiteContentAdmin } from '@/app/_server/controllers/bbs-site-content/getBbsSiteContentAdmin';
import { updateBbsSiteContent } from '@/app/_server/controllers/bbs-site-content/updateBbsSiteContent';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getBbsSiteContentAdmin);

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateBbsSiteContent);
