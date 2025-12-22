import { reorderBrands } from '@/app/_server/controllers/brands/reorderBrands';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(reorderBrands);
