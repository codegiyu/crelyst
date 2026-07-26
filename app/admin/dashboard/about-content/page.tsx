import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AboutContentPageClient } from '@/components/section/admin/about-content/AboutContentPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crelyst CMS — About',
  description: 'Manage Crelyst about page content',
};

export default function CrelystAboutContentAdminPage() {
  return (
    <DashboardLayout>
      <AboutContentPageClient />
    </DashboardLayout>
  );
}
