'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientProject } from '@/lib/constants/endpoints';
import { Star, Calendar, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProjectDetailHeroProps {
  project: ClientProject;
}

export const ProjectDetailHero = ({ project }: ProjectDetailHeroProps) => {
  const { siteLoading } = useSiteStore(state => state);
  const cs = project.caseStudy;
  const heroSrc = project.heroImage || project.featuredImage;
  const useCaseStudyHero = Boolean(cs && heroSrc);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return null;
    }
  };

  if (useCaseStudyHero) {
    return (
      <header className="relative w-full pt-24 md:pt-32 pb-12 md:pb-20">
        <SectionContainer className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">{cs!.industry}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 font-heading">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mb-10">
              {project.description}
            </p>
            <div className="w-20 h-0.5 bg-primary" />
          </motion.div>
        </SectionContainer>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={siteLoading ? {} : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="regular-container mx-auto px-4 sm:px-6 mt-12 md:mt-16 max-w-7xl">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border shadow-elegant">
            <Image
              src={heroSrc!}
              alt={`${project.title} hero`}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </header>
    );
  }

  return (
    <div className="relative w-full">
      {project.bannerImage && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.bannerImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
      )}

      <SectionContainer
        className={cn(
          'relative z-10 min-h-[min(900px,75vh)] flex items-center',
          project.bannerImage ? '' : 'bg-gradient-to-br from-accent/5 via-background to-primary/5'
        )}>
        {!project.bannerImage && (
          <div className="absolute inset-0 pattern-overlay pointer-events-none" />
        )}

        <div className="relative z-10 regular-container w-full">
          <div className="text-center">
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
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    project.bannerImage
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-primary/10 text-primary'
                  )}>
                  {project.category}
                </span>
              )}
              {project.status && (
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full capitalize',
                    project.bannerImage
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'bg-secondary/10 text-secondary'
                  )}>
                  {project.status}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-heading',
                project.bannerImage ? 'text-white' : 'text-foreground'
              )}>
              {project.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                'text-lg md:text-xl max-w-2xl mx-auto mb-8',
                project.bannerImage ? 'text-white/90' : 'text-muted-foreground'
              )}>
              {project.shortDescription || project.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={siteLoading ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={cn(
                'flex items-center justify-center gap-6 flex-wrap text-sm',
                project.bannerImage ? 'text-white/80' : 'text-muted-foreground'
              )}>
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
    </div>
  );
};
