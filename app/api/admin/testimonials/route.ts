import { listTestimonials } from '@/app/_server/controllers/testimonials/listTestimonials';
import { createTestimonial } from '@/app/_server/controllers/testimonials/createTestimonial';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listTestimonials('console'));
export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createTestimonial);
