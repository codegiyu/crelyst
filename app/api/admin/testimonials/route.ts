import { listTestimonials } from '@/app/_server/controllers/testimonials/listTestimonials';
import { createTestimonial } from '@/app/_server/controllers/testimonials/createTestimonial';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listTestimonials);
export const POST = applyMiddlewares(createTestimonial);
