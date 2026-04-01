import { handleEmailBounce } from '@/app/_server/controllers/webhooks/handleEmailBounce';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const POST = (request: NextRequest) => handleApiRoute(request, {}, handleEmailBounce);
