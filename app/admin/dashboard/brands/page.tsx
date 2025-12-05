import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BrandsPageClient } from '@/components/section/admin/brands/BrandsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Brands',
  description: 'Manage your brands',
};

export default function BrandsPage() {
  return (
    <DashboardLayout>
      <BrandsPageClient />
    </DashboardLayout>
  );
}
