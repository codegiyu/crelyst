import { getService } from '@/app/_server/controllers/services/getService';
import { updateService } from '@/app/_server/controllers/services/updateService';
import { deleteService } from '@/app/_server/controllers/services/deleteService';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getService);
export const PATCH = applyMiddlewares(updateService);
export const DELETE = applyMiddlewares(deleteService);
