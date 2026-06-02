import { presignFormSubmissionAttachments } from '@/app/_server/controllers/public/presignFormSubmissionAttachments';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const POST = (request: NextRequest) =>
  handleApiRoute(request, {}, presignFormSubmissionAttachments);
