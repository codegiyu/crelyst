import { catchAsync } from '../../middlewares/catchAsync';
import { sendResponse } from '../../lib/utils/appResponse';
import { deleteFields } from '../../middlewares/protectRoutes';
import { unselectedFields } from '../../models/user';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Get session controller (protected endpoint)
export const getSession = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { user } = context as RequestContext;

    if (!user) {
      return sendResponse(
        200,
        {
          admin: null,
        },
        'No active session'
      );
    }

    // Remove sensitive fields before returning
    const sanitizedAdmin = await deleteFields(user, unselectedFields);

    return sendResponse(
      200,
      {
        admin: sanitizedAdmin,
      },
      'Session retrieved successfully'
    );
  })
);
