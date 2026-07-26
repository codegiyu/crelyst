import { TestimonialsPageClient } from '@/components/section/admin/testimonials/TestimonialsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Testimonials',
  description: 'Manage client testimonials',
};

export default function TestimonialsPage() {
  return <TestimonialsPageClient />;
}
