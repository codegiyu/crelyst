import { PortfolioProjectsSeoPageClient } from '@/components/section/admin/portfolio/PortfolioProjectsSeoPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — Projects SEO',
  description: 'Manage Bold Brand Studio /projects listing SEO',
};

export default function PortfolioProjectsSeoAdminPage() {
  return <PortfolioProjectsSeoPageClient />;
}
