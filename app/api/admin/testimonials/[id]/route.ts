import { getTestimonial } from '@/app/_server/controllers/testimonials/getTestimonial';
import { updateTestimonial } from '@/app/_server/controllers/testimonials/updateTestimonial';
import { deleteTestimonial } from '@/app/_server/controllers/testimonials/deleteTestimonial';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getTestimonial('console'));
export const PATCH = applyMiddlewares(updateTestimonial);
export const DELETE = applyMiddlewares(deleteTestimonial);
