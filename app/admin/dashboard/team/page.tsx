import { TeamMembersPageClient } from '@/components/section/admin/team/TeamMembersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Members',
  description: 'Manage team members',
};

export default function TeamPage() {
  return <TeamMembersPageClient />;
}
