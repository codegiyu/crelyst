import { sendResponse } from '../../lib/utils/appResponse';
import { deleteFields } from '../../middlewares/protectRoutes';
import { unselectedFields } from '../../lib/constants/sessionFields';
import type { RouteHandler } from '../../lib/api/routeHandler';

export const getSession: RouteHandler = async ({ user }) => {
  if (!user) {
    return sendResponse(
      200,
      {
        admin: null,
      },
      'No active session'
    );
  }

  const sanitizedAdmin = await deleteFields(user as Record<string, unknown>, unselectedFields);

  return sendResponse(
    200,
    {
      admin: sanitizedAdmin,
    },
    'Session retrieved successfully'
  );
};
