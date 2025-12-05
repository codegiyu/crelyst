import { handleEmailBounce } from '@/app/_server/controllers/webhooks/handleEmailBounce';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(handleEmailBounce);
