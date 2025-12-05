import { verifyDocumentUpload } from '@/app/_server/controllers/webhooks/verifyDocumentUpload';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(verifyDocumentUpload);
