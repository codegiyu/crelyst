import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — About',
  description: 'Manage Bold Brand Studio about section content',
};

export default function PortfolioAboutAdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2 p-1">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-sm text-muted-foreground">
          Bold Brand Studio about content management will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
}
