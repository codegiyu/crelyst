import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TeamMembersPageClient } from '@/components/section/admin/team/TeamMembersPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { ITeamMembersListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Members',
  description: 'Manage team members',
};

export default async function TeamPage() {
  const res = await fetchAdminJson<ITeamMembersListRes>('/api/admin/team-members?limit=100');

  return (
    <DashboardLayout>
      <TeamMembersPageClient initialTeamMembers={res.teamMembers} />
    </DashboardLayout>
  );
}
