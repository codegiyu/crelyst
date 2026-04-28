import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with us',
  description: 'Applications from the work with us page',
};

export default async function WorkWithUsInboxPage() {
  redirect('/admin/dashboard/work-with-us');
}
