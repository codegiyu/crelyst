import { getBrand } from '@/app/_server/controllers/brands/getBrand';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getBrand('client'));
