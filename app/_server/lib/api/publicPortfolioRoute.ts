import type { NextRequest } from 'next/server';
import { handleApiRoute, type RouteHandler } from '@/app/_server/lib/api/routeHandler';
import {
  corsHeadersForOrigin,
  isBoldBrandStudioOrigin,
  withPortfolioCors,
} from '@/app/_server/lib/utils/portfolioCors';

function rejectCors(_origin: string | null): Response {
  return new Response(JSON.stringify({ status: false, message: 'Origin not allowed' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handlePublicPortfolioApiRoute(
  request: NextRequest,
  handler: RouteHandler
): Promise<Response> {
  const origin = request.headers.get('origin');

  if (request.method === 'OPTIONS') {
    if (!isBoldBrandStudioOrigin(origin)) {
      return rejectCors(origin);
    }
    return new Response(null, { status: 204, headers: corsHeadersForOrigin(origin) });
  }

  if (origin && !isBoldBrandStudioOrigin(origin)) {
    return rejectCors(origin);
  }

  const response = await handleApiRoute(request, { accessType: 'client' }, handler);
  return withPortfolioCors(response, origin);
}
