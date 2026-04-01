import { reorderTestimonials } from '@/app/_server/controllers/testimonials/reorderTestimonials';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, reorderTestimonials);
