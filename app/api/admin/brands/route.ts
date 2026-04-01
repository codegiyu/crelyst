import { listBrands } from '@/app/_server/controllers/brands/listBrands';
import { createBrand } from '@/app/_server/controllers/brands/createBrand';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listBrands('console'));
export const POST = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, createBrand);
