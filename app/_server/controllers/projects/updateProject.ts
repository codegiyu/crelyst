import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Project } from '../../models/project';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

// Update project (admin only)
export const updateProject = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, req, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const identifier = pathParts[pathParts.length - 1];

    if (!identifier) {
      throw new AppError('Project identifier is required', 400);
    }

    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const {
      title,
      slug: newSlug,
      description,
      shortDescription,
      featuredImage,
      cardImage,
      bannerImage,
      images,
      technologies,
      category,
      status,
      clientName,
      clientWebsite,
      projectUrl,
      githubUrl,
      startDate,
      endDate,
      isFeatured,
      displayOrder,
      seo,
    } = body;

    // Check if project exists and validate slug uniqueness if slug is being updated
    const currentProject = await Project.findOne(query).select('slug').lean();
    if (!currentProject) {
      throw new AppError('Project not found', 404);
    }

    // If slug is being updated, check if new slug already exists
    if (newSlug && newSlug !== currentProject.slug) {
      const existingProject = await Project.findOne({ slug: newSlug });
      if (existingProject) {
        throw new AppError('Project with this slug already exists', 409);
      }
    }

    // Build update object with only provided fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (newSlug !== undefined) updateData.slug = newSlug;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (cardImage !== undefined) updateData.cardImage = cardImage;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
    if (images !== undefined) updateData.images = images;
    if (technologies !== undefined) updateData.technologies = technologies;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;
    if (clientName !== undefined) updateData.clientName = clientName;
    if (clientWebsite !== undefined) updateData.clientWebsite = clientWebsite;
    if (projectUrl !== undefined) updateData.projectUrl = projectUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : undefined;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (seo !== undefined) updateData.seo = seo;

    const project = await Project.findOneAndUpdate(query, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return sendResponse(200, { project }, 'Project updated successfully');
  })
);
