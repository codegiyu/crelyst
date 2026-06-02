'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientProject } from '@/lib/constants/endpoints';
import { ArrowRight } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ProjectPreviewCard } from './ProjectPreviewCard';

export const ProjectsPreviewSection = ({ projects }: { projects: ClientProject[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const sortedProjects = [...projects]
    .filter(project => project.isActive !== false)
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    })
    .slice(0, 6);

  const displayProjects = sortedProjects.slice(0, 6);
  const featuredProject = displayProjects[0];
  const otherProjects = displayProjects.slice(1);

  return (
    <SectionContainer>
      <SectionHeading
        caption="Portfolio"
        title="Our Creative Work"
        text="Discover how we've helped brands express their unique personality through powerful visuals and storytelling"
      />

      {displayProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">Projects coming soon.</p>
        </motion.div>
      ) : (
        <>
          <div className="layout-grid-cards">
            {featuredProject && (
              <ProjectPreviewCard project={featuredProject} index={0} featured={true} />
            )}
            {otherProjects.map((project, index) => (
              <ProjectPreviewCard key={project.slug} project={project} index={index + 1} />
            ))}
          </div>

          {projects.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center mt-12">
              <RegularBtn
                linkProps={{ href: '/projects' }}
                variant="outline"
                RightIcon={ArrowRight}
                rightIconProps={{ className: 'size-4' }}
                text="View All Projects"
                className="px-8"
              />
            </motion.div>
          )}
        </>
      )}
    </SectionContainer>
  );
};
