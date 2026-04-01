import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ServicesPageClient } from '@/components/section/admin/services/ServicesPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IServicesListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ManageServices',
  description: 'Manage your services',
};

export default async function ServicesPage() {
  const res = await fetchAdminJson<IServicesListRes>('/api/admin/services?limit=100');

  return (
    <DashboardLayout>
      <ServicesPageClient initialServices={res.services} />
    </DashboardLayout>
  );
}
