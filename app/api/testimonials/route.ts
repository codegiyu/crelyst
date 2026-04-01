import { listTestimonials } from '@/app/_server/controllers/testimonials/listTestimonials';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { accessType: 'client' }, listTestimonials('client'));
