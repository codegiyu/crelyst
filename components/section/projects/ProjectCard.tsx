'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientProject } from '@/lib/constants/endpoints';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface ProjectCardProps {
  project: ClientProject;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={siteLoading ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Link
        href={`/projects/${project.slug}`}
        className="group block h-full bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-elegant transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {project.cardImage || project.featuredImage ? (
            <img
              src={project.cardImage || project.featuredImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/30">{project.title.charAt(0)}</span>
            </div>
          )}

          {/* Featured Badge */}
          {project.isFeatured && (
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}

          {/* Category Badge */}
          {project.category && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
              {project.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.shortDescription || project.description}
          </p>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.technologies.slice(0, 3).map(tech => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center text-primary font-medium text-sm">
            <span>View Project</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
