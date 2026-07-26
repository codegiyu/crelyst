import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioAboutPageClient } from '@/components/section/admin/portfolio/PortfolioAboutPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — About',
  description: 'Manage Bold Brand Studio about section content',
};

export default function PortfolioAboutAdminPage() {
  return (
    <DashboardLayout>
      <PortfolioAboutPageClient />
    </DashboardLayout>
  );
}
