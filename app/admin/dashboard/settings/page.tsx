import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsPageClient } from '@/components/section/admin/settings/SettingsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage site settings and configuration',
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsPageClient />
    </DashboardLayout>
  );
}
