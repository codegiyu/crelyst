import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestimonialsPageClient } from '@/components/section/admin/testimonials/TestimonialsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Testimonials',
  description: 'Manage your client testimonials',
};

export default function TestimonialsPage() {
  return (
    <DashboardLayout>
      <TestimonialsPageClient />
    </DashboardLayout>
  );
}
