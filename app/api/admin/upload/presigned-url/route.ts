import { generatePresignedUrlController } from '@/app/_server/controllers/upload/generatePresignedUrl';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const POST = (request: NextRequest) =>
  handleApiRoute(
    request,
    { protect: true, accessType: 'console' },
    generatePresignedUrlController('console')
  );
