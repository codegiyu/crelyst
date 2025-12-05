import { getTestimonial } from '@/app/_server/controllers/testimonials/getTestimonial';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getTestimonial);
