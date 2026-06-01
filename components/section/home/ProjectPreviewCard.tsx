'use client';

import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import type { ClientProject } from '@/lib/constants/endpoints';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const ProjectPreviewCard = ({
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
              <Image
                src={project.cardImage || project.featuredImage || ''}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-40"
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
              {/* {project.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )} */}
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

            <p
              className={`hidden text-white/80 mb-4 line-clamp-2 ${featured ? 'text-base' : 'text-sm'}`}>
              {project.shortDescription || project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="hidden flex-wrap gap-1.5 mb-4">
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
