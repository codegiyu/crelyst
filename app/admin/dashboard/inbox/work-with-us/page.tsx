import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsInboxClient } from '@/components/section/admin/inbox/FormSubmissionsInboxClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IFormSubmissionsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with us',
  description: 'Applications from the work with us page',
};

export default async function WorkWithUsInboxPage() {
  const res = await fetchAdminJson<IFormSubmissionsListRes>(
    '/api/admin/form-submissions?formType=work-with-us&limit=25'
  );

  return (
    <DashboardLayout>
      <FormSubmissionsInboxClient
        initial={res}
        formType="work-with-us"
        title="Work with us"
        description="Applications submitted through the careers form"
      />
    </DashboardLayout>
  );
}
