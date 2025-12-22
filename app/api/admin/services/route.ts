import { listServices } from '@/app/_server/controllers/services/listServices';
import { createService } from '@/app/_server/controllers/services/createService';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listServices('console'));
export const POST = applyMiddlewares(createService);
