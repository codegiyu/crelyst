import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsPageClient } from '@/components/section/admin/settings/SettingsPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage site settings and configuration',
};

export default async function SettingsPage() {
  const initialSettings = await fetchAdminJson<Partial<ClientSiteSettings>>(
    '/api/admin/site-settings/all'
  );

  return (
    <DashboardLayout>
      <SettingsPageClient initialSettings={initialSettings} />
    </DashboardLayout>
  );
}
