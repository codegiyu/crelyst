import { listBrands } from '@/app/_server/controllers/brands/listBrands';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listBrands('client'));
