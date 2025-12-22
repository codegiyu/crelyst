import { reorderTestimonials } from '@/app/_server/controllers/testimonials/reorderTestimonials';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(reorderTestimonials);
