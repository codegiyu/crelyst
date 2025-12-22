import { listProjects } from '@/app/_server/controllers/projects/listProjects';
import { createProject } from '@/app/_server/controllers/projects/createProject';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listProjects('console'));
export const POST = applyMiddlewares(createProject);
