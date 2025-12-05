import { reorderServices } from '@/app/_server/controllers/services/reorderServices';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(reorderServices);
