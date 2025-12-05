import { ServicesPageClient } from '@/components/section/services';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'From photography to packaging, explore our full range of creative design and branding services to help your brand express its unique personality.',
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
