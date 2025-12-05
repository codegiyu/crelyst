import { reorderProjects } from '@/app/_server/controllers/projects/reorderProjects';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(reorderProjects);
