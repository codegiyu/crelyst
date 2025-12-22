import { listProjects } from '@/app/_server/controllers/projects/listProjects';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listProjects('client'));
