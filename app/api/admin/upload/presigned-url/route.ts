import { generatePresignedUrlController } from '@/app/_server/controllers/upload/generatePresignedUrl';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const POST = applyMiddlewares(generatePresignedUrlController('console'));
