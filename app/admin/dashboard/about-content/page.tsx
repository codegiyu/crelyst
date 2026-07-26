import { DashboardLayout } from '@/components/layout/DashboardLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crelyst CMS — About',
  description: 'Manage Crelyst about page content',
};

export default function CrelystAboutContentAdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-2 p-1">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-sm text-muted-foreground">
          Crelyst about page content management will appear here.
        </p>
      </div>
    </DashboardLayout>
  );
}
