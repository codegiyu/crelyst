import { ServiceDetailClient } from '@/components/section/services';
import type { Metadata } from 'next';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  // Format slug for display (e.g., "web-development" -> "Web Development")
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Our Services`,
    description: `Learn more about our ${title.toLowerCase()} services and how we can help your business succeed.`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;

  return <ServiceDetailClient slug={slug} />;
}
