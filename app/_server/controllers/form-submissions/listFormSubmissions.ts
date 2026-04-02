import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  listFormSubmissions as listFormSubmissionsRepo,
  countUnreadByFormType,
  type FormSubmissionFormType,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

function toClientRow(row: { id: string; [key: string]: unknown }) {
  const { id, ...rest } = row;
  return {
    ...rest,
    _id: id,
    isRead: rest.isRead === true,
  };
}

export const listFormSubmissions: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const formType = url.searchParams.get('formType') as FormSubmissionFormType | null;
  if (formType !== 'quote-request' && formType !== 'work-with-us') {
    throw new AppError('formType must be quote-request or work-with-us', 400);
  }

  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const cursor = url.searchParams.get('cursor');

  const [{ items, total, nextCursor, hasMore, limit: appliedLimit }, unreadCount] =
    await Promise.all([
      listFormSubmissionsRepo(formType, { limit, cursor: cursor || null }),
      countUnreadByFormType(formType),
    ]);
  const submissions = items.map(item =>
    toClientRow(item as { id: string; [key: string]: unknown })
  );

  return sendResponse(
    200,
    {
      submissions,
      unreadCount,
      nextCursor,
      hasMore,
      pagination: {
        total,
        limit: appliedLimit,
      },
    },
    'Submissions fetched successfully'
  );
};
