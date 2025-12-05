import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ServicesPageClient } from '@/components/section/admin/services/ServicesPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ManageServices',
  description: 'Manage your services',
};

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <ServicesPageClient />
    </DashboardLayout>
  );
}
