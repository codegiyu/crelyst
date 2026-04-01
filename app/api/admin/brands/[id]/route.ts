import { getBrand } from '@/app/_server/controllers/brands/getBrand';
import { updateBrand } from '@/app/_server/controllers/brands/updateBrand';
import { deleteBrand } from '@/app/_server/controllers/brands/deleteBrand';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, getBrand('console'));
export const PATCH = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, updateBrand);
export const DELETE = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, deleteBrand);
