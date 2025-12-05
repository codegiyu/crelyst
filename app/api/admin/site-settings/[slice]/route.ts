import { fetchSettings } from '@/app/_server/controllers/site/fetchSettings';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(fetchSettings('client'));
