import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioContactPageClient } from '@/components/section/admin/portfolio/PortfolioContactPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — Contact',
  description: 'Manage Bold Brand Studio contact and social details',
};

export default function PortfolioContactAdminPage() {
  return (
    <DashboardLayout>
      <PortfolioContactPageClient />
    </DashboardLayout>
  );
}
