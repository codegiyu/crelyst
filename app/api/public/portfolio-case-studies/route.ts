import { listPublicPortfolioCaseStudies } from '@/app/_server/controllers/portfolio-case-studies/listPublicPortfolioCaseStudies';
import { handlePublicPortfolioApiRoute } from '@/app/_server/lib/api/publicPortfolioRoute';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, listPublicPortfolioCaseStudies);

export const OPTIONS = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, async () => new Response(null, { status: 204 }));
