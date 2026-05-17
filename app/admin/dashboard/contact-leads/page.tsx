import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsReadOnlyPageClient } from '@/components/section/admin/inbox/FormSubmissionsReadOnlyPageClient';
import { fetchAdminJsonOrNull } from '@/app/_server/lib/api/fetchAdminJson';
import type { IFormSubmissionsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact leads',
  description: 'Quote requests from the contact page',
};

const EMPTY_SUBMISSIONS: IFormSubmissionsListRes = {
  submissions: [],
  unreadCount: 0,
  nextCursor: null,
  hasMore: false,
  pagination: {
    total: 0,
    limit: 25,
  },
};

export default async function ContactLeadsPage() {
  const res = await fetchAdminJsonOrNull<IFormSubmissionsListRes>(
    '/api/admin/form-submissions?formType=quote-request&limit=25'
  );

  return (
    <DashboardLayout>
      <FormSubmissionsReadOnlyPageClient
        initial={res ?? EMPTY_SUBMISSIONS}
        formType="quote-request"
        title="Contact leads"
        description="Quote requests submitted through the contact form"
        loadFailed={res === null}
      />
    </DashboardLayout>
  );
}
