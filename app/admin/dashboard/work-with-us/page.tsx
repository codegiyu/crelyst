import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsReadOnlyPageClient } from '@/components/section/admin/inbox/FormSubmissionsReadOnlyPageClient';
import { fetchAdminJson } from '@/app/_server/lib/api/fetchAdminJson';
import type { IFormSubmissionsListRes } from '@/lib/constants/endpoints';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with us',
  description: 'Applications from the work with us page',
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

export default async function WorkWithUsPage() {
  let res = EMPTY_SUBMISSIONS;
  try {
    res = await fetchAdminJson<IFormSubmissionsListRes>(
      '/api/admin/form-submissions?formType=work-with-us&limit=50'
    );
  } catch {
    // Keep page reachable even when submissions API errors out.
  }

  return (
    <DashboardLayout>
      <FormSubmissionsReadOnlyPageClient
        initial={res}
        formType="work-with-us"
        title="Work with us"
        description="Applications submitted through the careers form"
      />
    </DashboardLayout>
  );
}
