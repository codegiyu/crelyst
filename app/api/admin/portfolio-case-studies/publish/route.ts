import { publishPortfolioCaseStudies } from '@/app/_server/controllers/portfolio-case-studies/publishPortfolioCaseStudies';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, publishPortfolioCaseStudies);
