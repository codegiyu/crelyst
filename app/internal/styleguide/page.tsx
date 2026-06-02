import type { Metadata } from 'next';
import { StyleguideView } from '@/components/styleguide/StyleguideView';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientTestimonial, ITestimonialsListRes } from '@/lib/constants/endpoints';
import { styleguideFallbackTestimonial } from '@/lib/fixtures/styleguideMocks';

export const metadata: Metadata = {
  title: 'Styleguide (internal)',
  robots: {
    index: false,
    follow: false,
  },
};

function pickStyleguideTestimonial(testimonials: ClientTestimonial[]): ClientTestimonial {
  const sorted = [...testimonials]
    .filter(t => t.isActive !== false)
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });

  return sorted[0] ?? styleguideFallbackTestimonial;
}

export default async function StyleguidePage() {
  const testimonialsRes = await serverFetchJsonOrNull<ITestimonialsListRes>(
    '/api/testimonials?limit=20'
  );
  const sampleTestimonial = pickStyleguideTestimonial(testimonialsRes?.testimonials ?? []);

  return <StyleguideView sampleTestimonial={sampleTestimonial} />;
}
