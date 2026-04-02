import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { countUnreadByFormType } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

export const getUnreadFormSubmissionCounts: RouteHandler = async ({ user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const [quoteRequest, workWithUs] = await Promise.all([
    countUnreadByFormType('quote-request'),
    countUnreadByFormType('work-with-us'),
  ]);

  return sendResponse(
    200,
    { quoteRequestUnread: quoteRequest, workWithUsUnread: workWithUs },
    'Unread counts fetched successfully'
  );
};
