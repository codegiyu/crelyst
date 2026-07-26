import { getPublicPortfolioCaseStudy } from '@/app/_server/controllers/portfolio-case-studies/getPublicPortfolioCaseStudy';
import { handlePublicPortfolioApiRoute } from '@/app/_server/lib/api/publicPortfolioRoute';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, getPublicPortfolioCaseStudy);

export const OPTIONS = (request: NextRequest) =>
  handlePublicPortfolioApiRoute(request, async () => new Response(null, { status: 204 }));
