import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestimonialsPageClient } from '@/components/section/admin/testimonials/TestimonialsPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { ITestimonialsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Testimonials',
  description: 'Manage client testimonials',
};

export default async function TestimonialsPage() {
  const res = await fetchAdminJson<ITestimonialsListRes>('/api/admin/testimonials?limit=100');

  return (
    <DashboardLayout>
      <TestimonialsPageClient initialTestimonials={res.testimonials} />
    </DashboardLayout>
  );
}
