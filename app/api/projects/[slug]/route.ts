import { getProject } from '@/app/_server/controllers/projects/getProject';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getProject('client'));
