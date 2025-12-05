import { updateSettings } from '@/app/_server/controllers/site/updateSettings';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(updateSettings);
