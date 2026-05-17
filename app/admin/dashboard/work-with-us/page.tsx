import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormSubmissionsReadOnlyPageClient } from '@/components/section/admin/inbox/FormSubmissionsReadOnlyPageClient';
import { fetchAdminJsonOrNull } from '@/app/_server/lib/api/fetchAdminJson';
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
    limit: 25,
  },
};

export default async function WorkWithUsPage() {
  const res = await fetchAdminJsonOrNull<IFormSubmissionsListRes>(
    '/api/admin/form-submissions?formType=work-with-us&limit=25'
  );

  return (
    <DashboardLayout>
      <FormSubmissionsReadOnlyPageClient
        initial={res ?? EMPTY_SUBMISSIONS}
        formType="work-with-us"
        title="Work with us"
        description="Applications submitted through the careers form"
        loadFailed={res === null}
      />
    </DashboardLayout>
  );
}
