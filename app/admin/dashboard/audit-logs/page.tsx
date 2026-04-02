import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuditLogsPageClient } from '@/components/section/admin/audit-logs/AuditLogsPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IAuditLogsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit log',
  description: 'Admin API audit trail',
};

export default async function AuditLogsPage() {
  const res = await fetchAdminJson<IAuditLogsListRes>('/api/admin/audit-logs?limit=40');

  return (
    <DashboardLayout>
      <AuditLogsPageClient initial={res} />
    </DashboardLayout>
  );
}
