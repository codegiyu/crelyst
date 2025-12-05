import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { TeamMember } from '../../models/teamMember';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Delete team member (admin only)
export const deleteTeamMember = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Team member identifier is required', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(identifier)) {
      throw new AppError('Invalid team member ID format', 400);
    }

    const teamMember = await TeamMember.findByIdAndDelete(identifier);

    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }

    return sendResponse(200, null, 'Team member deleted successfully');
  })
);
