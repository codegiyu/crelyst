import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Project } from '../../models/project';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';

// List all projects (public)
export const listProjects = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const status = url.searchParams.get('status');
      const category = url.searchParams.get('category');
      const isFeatured = url.searchParams.get('isFeatured');
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const skip = (page - 1) * limit;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};
      // Only apply isActive filter for client requests, not console requests
      if (accessType !== 'console') {
        query.isActive = true;
      }
      if (status) query.status = status;
      if (category) query.category = category;
      if (isFeatured !== null) {
        query.isFeatured = isFeatured === 'true';
      }

      const projects = await Project.find(query)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Project.countDocuments(query);

      return sendResponse(
        200,
        {
          projects,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        'Projects fetched successfully'
      );
    })
  );
