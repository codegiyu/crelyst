import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact leads',
  description: 'Quote requests from the contact page',
};

export default async function ContactInboxPage() {
  redirect('/admin/dashboard/contact-leads');
}
