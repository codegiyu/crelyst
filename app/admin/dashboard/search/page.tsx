import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminSearchPageClient } from '@/components/section/admin/search/AdminSearchPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search CMS content',
};

export default function AdminSearchPage() {
  return (
    <DashboardLayout>
      <AdminSearchPageClient />
    </DashboardLayout>
  );
}
