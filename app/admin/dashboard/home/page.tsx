import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHomeClient } from '@/components/section/admin/dashboard/DashboardHomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview',
};

export default function DashboardHomePage() {
  return (
    <DashboardLayout>
      <DashboardHomeClient />
    </DashboardLayout>
  );
}
