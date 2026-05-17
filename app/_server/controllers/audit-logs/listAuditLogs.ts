import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { validateQuery } from '../../lib/api/validateQuery';
import { auditLogsListQuerySchema } from '../../lib/validation/listQuery';
import { listAuditLogs as listAuditLogsRepo } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';

function toClientEntry(row: { id: string; [key: string]: unknown }) {
  const { id, ...rest } = row;
  return { ...rest, _id: id };
}

export const listAuditLogs: RouteHandler = async ({ request, user }) => {
  if (!user || !(user as { _id?: string })._id) {
    throw new AppError('Unauthorized', 401);
  }

  const url = new URL(request.url);
  const { limit, cursor, q } = validateQuery(auditLogsListQuerySchema, url.searchParams);

  const result = await listAuditLogsRepo({
    limit,
    cursor,
    query: q,
  });

  const entries = result.items.map(item =>
    toClientEntry(item as { id: string; [key: string]: unknown })
  );

  return sendResponse(
    200,
    {
      entries,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      searchActive: result.searchActive,
      pagination: {
        total: result.total,
        limit: result.limit,
      },
    },
    'Audit logs fetched successfully'
  );
};
