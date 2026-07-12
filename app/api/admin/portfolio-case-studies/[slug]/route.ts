import {
  getPortfolioCaseStudyAdmin,
  updatePortfolioCaseStudyAdmin,
  deletePortfolioCaseStudyAdmin,
} from '@/app/_server/controllers/portfolio-case-studies/portfolioCaseStudyAdmin';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getPortfolioCaseStudyAdmin);

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updatePortfolioCaseStudyAdmin);

export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deletePortfolioCaseStudyAdmin);
