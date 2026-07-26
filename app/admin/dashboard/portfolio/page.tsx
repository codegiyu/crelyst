import { PortfolioPageClient } from '@/components/section/admin/portfolio/PortfolioPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — Projects',
  description: 'Manage Bold Brand Studio portfolio case studies',
};

export default function PortfolioAdminPage() {
  return <PortfolioPageClient />;
}
