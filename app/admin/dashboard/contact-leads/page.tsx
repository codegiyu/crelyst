import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsReadOnlyPageClient } from '@/components/section/admin/inbox/FormSubmissionsReadOnlyPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
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
    limit: 50,
  },
};

export default async function ContactLeadsPage() {
  let res = EMPTY_SUBMISSIONS;
  try {
    res = await fetchAdminJson<IFormSubmissionsListRes>(
      '/api/admin/form-submissions?formType=quote-request&limit=50'
    );
  } catch {
    // Keep page reachable even when submissions API errors out.
  }

  return (
    <DashboardLayout>
      <FormSubmissionsReadOnlyPageClient
        initial={res}
        formType="quote-request"
        title="Contact leads"
        description="Quote requests submitted through the contact form"
      />
    </DashboardLayout>
  );
}
