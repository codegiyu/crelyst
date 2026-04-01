import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardHomeClient } from '@/components/section/admin/dashboard/DashboardHomeClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type {
  IBrandsListRes,
  IProjectsListRes,
  IServicesListRes,
  ITeamMembersListRes,
  ITestimonialsListRes,
} from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview',
};

const Q = '?limit=100';

export default async function DashboardHomePage() {
  const [servicesRes, projectsRes, testimonialsRes, brandsRes, teamRes] = await Promise.all([
    fetchAdminJson<IServicesListRes>(`/api/admin/services${Q}`),
    fetchAdminJson<IProjectsListRes>(`/api/admin/projects${Q}`),
    fetchAdminJson<ITestimonialsListRes>(`/api/admin/testimonials${Q}`),
    fetchAdminJson<IBrandsListRes>(`/api/admin/brands${Q}`),
    fetchAdminJson<ITeamMembersListRes>(`/api/admin/team-members${Q}`),
  ]);

  return (
    <DashboardLayout>
      <DashboardHomeClient
        initial={{
          services: servicesRes.services,
          projects: projectsRes.projects,
          testimonials: testimonialsRes.testimonials,
          brands: brandsRes.brands,
          teamMembers: teamRes.teamMembers,
        }}
      />
    </DashboardLayout>
  );
}
