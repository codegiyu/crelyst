import { submitWorkWithUs } from '@/app/_server/controllers/public/submitWorkWithUs';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const POST = (request: NextRequest) => handleApiRoute(request, {}, submitWorkWithUs);
