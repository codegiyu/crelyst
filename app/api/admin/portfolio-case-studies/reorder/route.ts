import { reorderPortfolioCaseStudiesAdmin } from '@/app/_server/controllers/portfolio-case-studies/reorderPortfolioCaseStudies';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const PATCH = (request: NextRequest) =>
  handleApiRoute(
    request,
    { protect: true, accessType: 'console' },
    reorderPortfolioCaseStudiesAdmin
  );
