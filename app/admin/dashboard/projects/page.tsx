import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectsPageClient } from '@/components/section/admin/projects/ProjectsPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IProjectsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Projects',
  description: 'Manage your portfolio projects',
};

export default async function ProjectsPage() {
  const res = await fetchAdminJson<IProjectsListRes>('/api/admin/projects?limit=100');

  return (
    <DashboardLayout>
      <ProjectsPageClient initialProjects={res.projects} />
    </DashboardLayout>
  );
}
