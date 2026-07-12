import { listPortfolioCaseStudiesAdmin } from '@/app/_server/controllers/portfolio-case-studies/listPortfolioCaseStudiesAdmin';
import { createPortfolioCaseStudy } from '@/app/_server/controllers/portfolio-case-studies/createPortfolioCaseStudy';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listPortfolioCaseStudiesAdmin);

export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createPortfolioCaseStudy);
