import { ContactPageClient } from '@/components/section/contact';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    "Get a customized quote for your design project. Tell us about your needs and we'll provide a tailored proposal.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
