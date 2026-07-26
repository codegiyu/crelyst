import { AuditLogsPageClient } from '@/components/section/admin/audit-logs/AuditLogsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audit log',
  description: 'Admin API audit trail',
};

export default function AuditLogsPage() {
  return <AuditLogsPageClient />;
}
