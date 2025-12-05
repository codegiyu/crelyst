import { ProjectDetailClient } from '@/components/section/projects';
import type { Metadata } from 'next';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Format slug for display (e.g., "my-project" -> "My Project")
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Our Projects`,
    description: `Discover the details of our ${title.toLowerCase()} project and see how we delivered exceptional results.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return <ProjectDetailClient slug={slug} />;
}
