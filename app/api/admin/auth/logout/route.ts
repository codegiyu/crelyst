import { logout } from '@/app/_server/controllers/auth/logout';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(logout);
