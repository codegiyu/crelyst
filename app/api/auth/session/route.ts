import { getSession } from '@/app/_server/controllers/auth/getSession';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getSession);
