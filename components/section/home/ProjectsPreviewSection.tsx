'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientProject } from '@/lib/constants/endpoints';
import { ArrowRight } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ProjectPreviewCard } from './ProjectPreviewCard';

const HOME_PROJECTS_PREVIEW_LIMIT = 6;

export const ProjectsPreviewSection = ({ projects }: { projects: ClientProject[] }) => {
  const { siteLoading } = useSiteStore(state => state);

  const activeProjects = [...projects]
    .filter(project => project.isActive !== false)
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });

  const displayProjects = activeProjects.slice(0, HOME_PROJECTS_PREVIEW_LIMIT);
  const showSeeMore = activeProjects.length > HOME_PROJECTS_PREVIEW_LIMIT;
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

          {showSeeMore ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center">
              <RegularBtn
                linkProps={{ href: '/projects' }}
                variant="outline"
                RightIcon={ArrowRight}
                rightIconProps={{ className: 'size-4 group-hover:translate-x-1 transition-transform' }}
                text="See More Projects"
                className="group px-8"
              />
            </motion.div>
          ) : null}
        </>
      )}
    </SectionContainer>
  );
};
