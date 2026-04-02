import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getFormSubmissionById,
  updateFormSubmission,
  type FormSubmissionFormType,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';

const patchSchema = z.object({
  isRead: z.boolean().optional(),
});

export const patchFormSubmission: RouteHandler = async ({ request, body, user }) => {
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

  const payload = validateBody(patchSchema, body);
  if (Object.keys(payload).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  const updated = await updateFormSubmission(id, payload);
  if (!updated) {
    throw new AppError('Submission not found', 404);
  }

  const row = updated as { id: string; [key: string]: unknown };
  return sendResponse(
    200,
    {
      submission: {
        ...row,
        _id: row.id,
        isRead: row.isRead === true,
      },
    },
    'Submission updated successfully'
  );
};
