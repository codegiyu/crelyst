import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio CMS — Contact',
  description: 'Manage Bold Brand Studio contact and social details',
};

export default function PortfolioContactAdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2 p-1">
        <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Bold Brand Studio contact and social management will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
}
