import { getUnreadFormSubmissionCounts } from '@/app/_server/controllers/form-submissions/getUnreadFormSubmissionCounts';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getUnreadFormSubmissionCounts);
