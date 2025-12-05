import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProjectsPageClient } from '@/components/section/admin/projects/ProjectsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Projects',
  description: 'Manage your portfolio projects',
};

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <ProjectsPageClient />
    </DashboardLayout>
  );
}
