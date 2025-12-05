'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { useProjectsStore } from '@/lib/store/useProjectsStore';
import { ClientProject } from '@/lib/constants/endpoints';
import { ArrowRight, Briefcase, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { RegularBtn } from '@/components/atoms/RegularBtn';

const ProjectPreviewCard = ({
  project,
  index,
  featured = false,
}: {
  project: ClientProject;
  index: number;
  featured?: boolean;
}) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={featured ? 'md:col-span-2 md:row-span-2' : ''}>
      <Link
        href={`/projects/${project.slug}`}
        className={`group block h-full bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-500 overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[4/3]'}`}>
        <div className="relative h-full">
          {/* Image */}
          <div className="absolute inset-0 bg-muted">
            {project.cardImage || project.featuredImage ? (
              <img
                src={project.cardImage || project.featuredImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary/20">
                  {project.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Overlay with creative gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />

          {/* Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              {project.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
              {project.category && (
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-xs font-medium rounded-full">
                  {project.category}
                </span>
              )}
            </div>

            <h3
              className={`font-bold text-white mb-2 group-hover:text-accent transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
              {project.title}
            </h3>

            <p className={`text-white/80 mb-4 line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
              {project.shortDescription || project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.slice(0, featured ? 5 : 3).map(tech => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs bg-white/10 backdrop-blur-sm rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center text-white font-medium text-sm">
              <span>View Project</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const ProjectsPreviewSection = () => {
  const { siteLoading } = useSiteStore(state => state);
  const { projects, isLoading } = useProjectsStore(state => ({
    projects: state.projects,
    isLoading: state.isLoading,
  }));

  // Get featured projects first, then recent ones
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
  });

  const displayProjects = sortedProjects.slice(0, 5);
  const featuredProject = displayProjects[0];
  const otherProjects = displayProjects.slice(1);

  return (
    <SectionContainer>
      <SectionHeading
        Icon={Briefcase}
        title="Our Creative Work"
        text="Discover how we've helped brands express their unique personality through powerful visuals and storytelling"
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 md:row-span-2">
            <Skeleton className="w-full h-full min-h-[400px] rounded-2xl" />
          </div>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : displayProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={siteLoading ? {} : { opacity: 1 }}
          className="text-center py-16">
          <p className="text-muted-foreground text-lg">Projects coming soon.</p>
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProject && (
              <ProjectPreviewCard project={featuredProject} index={0} featured={true} />
            )}
            {otherProjects.map((project, index) => (
              <ProjectPreviewCard key={project.slug} project={project} index={index + 1} />
            ))}
          </div>

          {projects.length > 5 && (
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
