import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Service } from '../../models/service';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// List all services (public)
export const listServices = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const url = new URL(req.url);
    const isActive = url.searchParams.get('isActive');
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }

    const services = await Service.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Service.countDocuments(query);

    return sendResponse(
      200,
      {
        services,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Services fetched successfully'
    );
  })
);
