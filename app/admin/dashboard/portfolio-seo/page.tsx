import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioSeoPageClient } from '@/components/section/admin/portfolio/PortfolioSeoPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — SEO',
  description: 'Manage Bold Brand Studio default SEO settings',
};

export default function PortfolioSeoAdminPage() {
  return (
    <DashboardLayout>
      <PortfolioSeoPageClient />
    </DashboardLayout>
  );
}
