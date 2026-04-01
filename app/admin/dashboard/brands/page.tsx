import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BrandsPageClient } from '@/components/section/admin/brands/BrandsPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IBrandsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Brands',
  description: 'Manage your brands',
};

export default async function BrandsPage() {
  const res = await fetchAdminJson<IBrandsListRes>('/api/admin/brands?limit=100');

  return (
    <DashboardLayout>
      <BrandsPageClient initialBrands={res.brands} />
    </DashboardLayout>
  );
}
