import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { TeamMember } from '../../models/teamMember';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// List all team members (public)
export const listTeamMembers = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const isActive = url.searchParams.get('isActive');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const teamMembers = await TeamMember.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await TeamMember.countDocuments(query);

    return sendResponse(
      200,
      {
        teamMembers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Team members fetched successfully'
    );
  })
);
