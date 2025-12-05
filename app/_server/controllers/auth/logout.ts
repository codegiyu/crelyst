import { catchAsync } from '../../middlewares/catchAsync';
import { sendResponse } from '../../lib/utils/appResponse';
import { clearAuthTokens } from '../../lib/utils/tokens';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Logout controller (protected endpoint)
export const logout = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { req, user } = context as RequestContext;

    // Clear auth tokens and update user's refreshTokenJTI
    await clearAuthTokens(req, user, 'console');

    return sendResponse(200, { success: true }, 'Logged out successfully');
  })
);
