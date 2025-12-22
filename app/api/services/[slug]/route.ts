import { getService } from '@/app/_server/controllers/services/getService';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getService('client'));
