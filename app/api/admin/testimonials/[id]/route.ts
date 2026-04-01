import { getTestimonial } from '@/app/_server/controllers/testimonials/getTestimonial';
import { updateTestimonial } from '@/app/_server/controllers/testimonials/updateTestimonial';
import { deleteTestimonial } from '@/app/_server/controllers/testimonials/deleteTestimonial';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getTestimonial('console'));
export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateTestimonial);
export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteTestimonial);
