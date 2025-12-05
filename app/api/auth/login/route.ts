import { login } from '@/app/_server/controllers/auth/login';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(login);
