import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioPageClient } from '@/components/section/admin/portfolio/PortfolioPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Portfolio (Bold Brand Studio)',
  description: 'Manage Bold Brand Studio portfolio case studies',
};

export default function PortfolioAdminPage() {
  return (
    <DashboardLayout>
      <PortfolioPageClient />
    </DashboardLayout>
  );
}
