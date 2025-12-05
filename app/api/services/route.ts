import { listServices } from '@/app/_server/controllers/services/listServices';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listServices);
