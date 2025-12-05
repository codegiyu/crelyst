import { AboutPageClient } from '@/components/section/about';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Crelyst, our creative design philosophy, and how we help brands express their unique personality through powerful visuals and storytelling.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
