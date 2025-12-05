'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { ProjectCard } from './ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectsGridSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { projects, isLoading } = useProjectsStore(state => ({
    projects: state.projects,
    isLoading: state.isLoading,
  }));

  return (
    <SectionContainer>
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">No projects available at the moment.</p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .sort((a, b) => {
              // Featured projects first
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              // Then by display order
              return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
            })
            .map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
        </div>
      )}
    </SectionContainer>
  );
};
