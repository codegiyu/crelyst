import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { TeamMember } from '../../models/teamMember';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Update team member (admin only)
export const updateTeamMember = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

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

    const { name, role, bio, image, email, phone, socials, isActive, displayOrder } = body;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (bio !== undefined) updateData.bio = bio;
    if (image !== undefined) updateData.image = image;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (socials !== undefined) updateData.socials = socials;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    const teamMember = await TeamMember.findByIdAndUpdate(identifier, updateData, {
      new: true,
      runValidators: true,
    });

    if (!teamMember) {
      throw new AppError('Team member not found', 404);
    }

    return sendResponse(200, { teamMember }, 'Team member updated successfully');
  })
);
