import { listBrands } from '@/app/_server/controllers/brands/listBrands';
import { createBrand } from '@/app/_server/controllers/brands/createBrand';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listBrands);
export const POST = applyMiddlewares(createBrand);
