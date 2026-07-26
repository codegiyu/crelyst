import { FormSubmissionsInboxClient } from '@/components/section/admin/inbox/FormSubmissionsInboxClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact leads',
  description: 'Quote requests from the contact page',
};

export default function ContactLeadsPage() {
  return (
    <FormSubmissionsInboxClient
      formType="quote-request"
      title="Contact leads"
      description="Quote requests submitted through the contact form"
    />
  );
}
