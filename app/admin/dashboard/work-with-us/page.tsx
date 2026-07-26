import { FormSubmissionsInboxClient } from '@/components/section/admin/inbox/FormSubmissionsInboxClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with us',
  description: 'Applications from the work with us page',
};

export default function WorkWithUsPage() {
  return (
    <FormSubmissionsInboxClient
      formType="work-with-us"
      title="Work with us"
      description="Applications submitted through the careers form"
    />
  );
}
