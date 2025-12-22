import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Project } from '../../models/project';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Create project (admin only)
export const createProject = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      title,
      slug,
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
      isActive,
      displayOrder,
      seo,
    } = body;

    if (!title || !description) {
      throw new AppError('Title and description are required', 400);
    }

    // If slug is provided, check if it already exists
    if (slug) {
      const existingProject = await Project.findOne({ slug });
      if (existingProject) {
        throw new AppError('Project with this slug already exists', 409);
      }
    }

    // Create project - slug will be auto-generated if not provided
    const project = await Project.create({
      title,
      ...(slug && { slug }),
      description,
      shortDescription: shortDescription || '',
      featuredImage: featuredImage || '',
      cardImage: cardImage || '',
      bannerImage: bannerImage || '',
      images: images || [],
      technologies: technologies || [],
      category: category || '',
      status: status || 'draft',
      clientName: clientName || '',
      clientWebsite: clientWebsite || '',
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0,
      seo: seo || {},
    });

    if (!project) {
      throw new AppError('Failed to create project', 500);
    }

    return sendResponse(201, { project }, 'Project created successfully');
  })
);
