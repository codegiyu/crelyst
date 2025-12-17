/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProjectDetailHero } from './ProjectDetailHero';
import { ProjectDetailContent } from './ProjectDetailContent';
import { ProjectGallery } from './ProjectGallery';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { ClientProject } from '@/lib/constants/endpoints';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionContainer } from '@/components/general/SectionContainer';
import { notFound } from 'next/navigation';

interface ProjectDetailClientProps {
  slug: string;
}

export const ProjectDetailClient = ({ slug }: ProjectDetailClientProps) => {
  const { getProjectBySlug, projectsBySlug } = useProjectsStore(state => ({
    getProjectBySlug: state.actions.getProjectBySlug,
    projectsBySlug: state.projectsBySlug,
  }));

  const [project, setProject] = useState<ClientProject | null>(projectsBySlug[slug] || null);
  const [isLoading, setIsLoading] = useState(!projectsBySlug[slug]);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectsBySlug[slug]) {
        setProject(projectsBySlug[slug]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetchedProject = await getProjectBySlug(slug);

      if (!fetchedProject) {
        setNotFoundState(true);
      } else {
        setProject(fetchedProject);
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [slug, projectsBySlug]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading) {
    return (
      <MainLayout transparentHeader>
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-8" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <MainLayout transparentHeader>
      <ProjectDetailHero project={project} />
      <ProjectDetailContent project={project} />
      {project.images && project.images.length > 0 && <ProjectGallery project={project} />}
    </MainLayout>
  );
};
