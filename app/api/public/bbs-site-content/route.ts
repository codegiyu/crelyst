import { getPublicBbsSiteContent } from '@/app/_server/controllers/bbs-site-content/getPublicBbsSiteContent';
import { handlePublicPortfolioApiRoute } from '@/app/_server/lib/api/publicPortfolioRoute';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, getPublicBbsSiteContent);

export const OPTIONS = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, async () => new Response(null, { status: 204 }));
