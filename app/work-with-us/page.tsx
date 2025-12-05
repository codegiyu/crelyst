import { WorkWithUsPageClient } from '@/components/section/work-with-us';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work With Us',
  description:
    'Join our creative network. We collaborate with talented freelance designers on select projects, sharing a percentage of each job.',
};

export default function WorkWithUsPage() {
  return <WorkWithUsPageClient />;
}
