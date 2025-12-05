import { ProjectsPageClient } from '@/components/section/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Projects',
  description:
    'Explore our creative portfolio showcasing photography, branding, product design, packaging, and visual identity work that brings brands to life.',
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
