import { deleteFormSubmission } from '@/app/_server/controllers/form-submissions/deleteFormSubmission';
import { patchFormSubmission } from '@/app/_server/controllers/form-submissions/patchFormSubmission';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, patchFormSubmission);

export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteFormSubmission);
