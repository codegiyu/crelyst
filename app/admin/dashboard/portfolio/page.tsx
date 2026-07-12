import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PortfolioPageClient } from '@/components/section/admin/portfolio/PortfolioPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IPortfolioCaseStudiesListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Portfolio (Bold Brand Studio)',
  description: 'Manage Bold Brand Studio portfolio case studies',
};

export default async function PortfolioAdminPage() {
  const res = await fetchAdminJson<IPortfolioCaseStudiesListRes>(
    '/api/admin/portfolio-case-studies?limit=100'
  );

  return (
    <DashboardLayout>
      <PortfolioPageClient initialCaseStudies={res.caseStudies} />
    </DashboardLayout>
  );
}
