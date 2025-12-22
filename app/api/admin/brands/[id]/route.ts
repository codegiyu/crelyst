import { getBrand } from '@/app/_server/controllers/brands/getBrand';
import { updateBrand } from '@/app/_server/controllers/brands/updateBrand';
import { deleteBrand } from '@/app/_server/controllers/brands/deleteBrand';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getBrand('console'));
export const PATCH = applyMiddlewares(updateBrand);
export const DELETE = applyMiddlewares(deleteBrand);
