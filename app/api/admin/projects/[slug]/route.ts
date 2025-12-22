import { getProject } from '@/app/_server/controllers/projects/getProject';
import { updateProject } from '@/app/_server/controllers/projects/updateProject';
import { deleteProject } from '@/app/_server/controllers/projects/deleteProject';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getProject('console'));
export const PATCH = applyMiddlewares(updateProject);
export const DELETE = applyMiddlewares(deleteProject);
