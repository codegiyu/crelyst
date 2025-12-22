import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Project } from '../../models/project';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import { ACCESS_TYPES } from '../../lib/types/constants';
import mongoose from 'mongoose';

// Get single project by slug or ID (public)
export const getProject = (accessType: ACCESS_TYPES = 'client') =>
  withRequestContext({ protect: false, accessType })(
    catchAsync(async context => {
      const { req } = context as RequestContext;
      const url = new URL(req.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      const identifier = pathParts[pathParts.length - 1];

      if (!identifier) {
        throw new AppError('Project identifier is required', 400);
      }

      const query = mongoose.Types.ObjectId.isValid(identifier)
        ? { _id: identifier }
        : { slug: identifier };

      const project = await Project.findOne(query).lean();

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      return sendResponse(200, { project }, 'Project fetched successfully');
    })
  );
