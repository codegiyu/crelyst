import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeamMembersPageClient } from '@/components/section/admin/team/TeamMembersPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Members',
  description: 'Manage your team members',
};

export default function TeamPage() {
  return (
    <DashboardLayout>
      <TeamMembersPageClient />
    </DashboardLayout>
  );
}
