'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientProject } from '@/lib/constants/endpoints';
import Link from 'next/link';
import { ChevronLeft, Star, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectDetailHeroProps {
  project: ClientProject;
}

export const ProjectDetailHero = ({ project }: ProjectDetailHeroProps) => {
  const { siteLoading } = useSiteStore(state => state);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return null;
    }
  };

  return (
    <SectionContainer className="relative overflow-hidden bg-gradient-to-br from-accent/5 via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-overlay pointer-events-none" />

      {/* Banner Image Overlay */}
      {project.bannerImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${project.bannerImage})` }}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={siteLoading ? {} : { opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <Link
            href="/projects"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="text-center">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 flex-wrap mb-6">
            {project.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                <Star className="w-3.5 h-3.5 fill-current" />
                Featured Project
              </span>
            )}
            {project.category && (
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {project.category}
              </span>
            )}
            {project.status && (
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full capitalize">
                {project.status}
              </span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-serif">
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {project.shortDescription || project.description}
          </motion.p>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
            {project.clientName && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{project.clientName}</span>
              </div>
            )}
            {(project.startDate || project.endDate) && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.startDate)}
                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
};
