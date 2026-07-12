import { sendResponse } from '../../lib/utils/appResponse';
import { listPortfolioCaseStudies } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { resolveListIsActiveQuery } from '../../lib/utils/listAccess';

export const listPortfolioCaseStudiesAdmin: RouteHandler = async ({ request }) => {
  const url = new URL(request.url);
  const isActiveParam = url.searchParams.get('isActive');
  const limit = parseInt(url.searchParams.get('limit') || '100', 10);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const isActive = resolveListIsActiveQuery('console', isActiveParam);

  const { items, total } = await listPortfolioCaseStudies({ isActive, limit, page });

  return sendResponse(
    200,
    {
      caseStudies: items.map(item => ({ ...item, _id: item.id })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    'Portfolio case studies fetched successfully'
  );
};
