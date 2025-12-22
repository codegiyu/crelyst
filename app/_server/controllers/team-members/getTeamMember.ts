import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { TeamMember } from '../../models/teamMember';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';
import mongoose from 'mongoose';

// Get single team member by ID (public)
export const getTeamMember = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const identifier = pathParts[pathParts.length - 1];

      if (!identifier) {
        throw new AppError('Team member identifier is required', 400);
      }

      if (!mongoose.Types.ObjectId.isValid(identifier)) {
        throw new AppError('Invalid team member ID format', 400);
      }

      const teamMember = await TeamMember.findById(identifier).lean();

      if (!teamMember) {
        throw new AppError('Team member not found', 404);
      }

      return sendResponse(200, { teamMember }, 'Team member fetched successfully');
    })
  );
