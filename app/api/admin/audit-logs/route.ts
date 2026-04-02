import { listAuditLogs } from '@/app/_server/controllers/audit-logs/listAuditLogs';
import { handleApiRoute } from '@/app/_server/lib/api/routeHandler';
import type { NextRequest } from 'next/server';

export const GET = (request: NextRequest) =>
  handleApiRoute(request, { protect: true, accessType: 'console' }, listAuditLogs);
