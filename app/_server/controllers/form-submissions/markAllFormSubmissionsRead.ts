import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  markAllFormSubmissionsRead as markAllRepo,
  type FormSubmissionFormType,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';

const bodySchema = z.object({
  formType: z.enum(['quote-request', 'work-with-us']),
});

export const markAllFormSubmissionsRead: RouteHandler = async ({ body, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const { formType } = validateBody(bodySchema, body);
  const result = await markAllRepo(formType as FormSubmissionFormType);

  return sendResponse(200, { modifiedCount: result.modifiedCount }, 'Submissions marked as read');
};
