import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  deleteFormSubmission as deleteFormSubmissionRepo,
  getFormSubmissionById,
  type FormSubmissionFormType,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

export const deleteFormSubmission: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    throw new AppError('Submission id is required', 400);
  }

  const formType = url.searchParams.get('formType') as FormSubmissionFormType | null;
  if (formType !== 'quote-request' && formType !== 'work-with-us') {
    throw new AppError('formType query must be quote-request or work-with-us', 400);
  }

  const existing = await getFormSubmissionById(id);
  const existingType = existing ? (existing as Record<string, unknown>)['formType'] : undefined;
  if (!existing || existingType !== formType) {
    throw new AppError('Submission not found', 404);
  }

  const deleted = await deleteFormSubmissionRepo(id);
  if (!deleted) {
    throw new AppError('Submission not found', 404);
  }

  return sendResponse(200, { success: true }, 'Submission deleted');
};
