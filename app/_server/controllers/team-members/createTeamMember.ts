import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { TeamMember } from '../../models/teamMember';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Create team member (admin only)
export const createTeamMember = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, role, bio, image, email, phone, socials, isActive, displayOrder } = body;

    if (!name || !role) {
      throw new AppError('Name and role are required', 400);
    }

    const newTeamMember = await TeamMember.create({
      name,
      role,
      bio: bio || '',
      image: image || '',
      email: email || '',
      phone: phone || '',
      socials: socials || {},
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
    });

    if (!newTeamMember) {
      throw new AppError('Failed to create team member', 500);
    }

    return sendResponse(201, { teamMember: newTeamMember }, 'Team member created successfully');
  })
);
