import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsInboxClient } from '@/components/section/admin/inbox/FormSubmissionsInboxClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IFormSubmissionsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact leads',
  description: 'Quote requests from the contact page',
};

export default async function ContactInboxPage() {
  const res = await fetchAdminJson<IFormSubmissionsListRes>(
    '/api/admin/form-submissions?formType=quote-request&limit=25'
  );

  return (
    <DashboardLayout>
      <FormSubmissionsInboxClient
        initial={res}
        formType="quote-request"
        title="Contact leads"
        description="Quote requests submitted through the contact form"
      />
    </DashboardLayout>
  );
}
