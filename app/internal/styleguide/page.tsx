import type { Metadata } from 'next';
import { StyleguideView } from '@/components/styleguide/StyleguideView';

export const metadata: Metadata = {
  title: 'Styleguide (internal)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StyleguidePage() {
  return <StyleguideView />;
}
