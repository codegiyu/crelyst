import { listTestimonials } from '@/app/_server/controllers/testimonials/listTestimonials';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listTestimonials);
