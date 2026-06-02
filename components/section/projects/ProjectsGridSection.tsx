'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ProjectCard } from './ProjectCard';
import type { ClientProject } from '@/lib/constants/endpoints';

export const ProjectsGridSection = ({ projects }: { projects: ClientProject[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer>
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">No projects available at the moment.</p>
        </motion.div>
      ) : (
        <div className="layout-grid-cards sm:grid-cols-2">
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
