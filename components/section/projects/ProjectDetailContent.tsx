'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientProject } from '@/lib/constants/endpoints';
import { ExternalLink, Github } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';

interface ProjectDetailContentProps {
  project: ClientProject;
}

export const ProjectDetailContent = ({ project }: ProjectDetailContentProps) => {
  const { siteLoading } = useSiteStore(state => state);

  return (
    <SectionContainer>
      <div className="max-w-4xl mx-auto">
        {/* Featured Image */}
        {project.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 rounded-2xl overflow-hidden aspect-video bg-muted shadow-elegant">
            <img
              src={project.featuredImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        {(project.projectUrl || project.githubUrl || project.clientWebsite) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 mb-12">
            {project.projectUrl && (
              <RegularBtn
                linkProps={{
                  href: project.projectUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }}
                RightIcon={ExternalLink}
                rightIconProps={{ className: 'size-4' }}
                text="View Live Project"
              />
            )}
            {project.githubUrl && (
              <GhostBtn
                linkProps={{
                  href: project.githubUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <Github className="w-4 h-4" />
                View Source
              </GhostBtn>
            )}
            {project.clientWebsite && (
              <GhostBtn
                linkProps={{
                  href: project.clientWebsite,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <ExternalLink className="w-4 h-4" />
                Client Website
              </GhostBtn>
            )}
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
            About This Project
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
        </motion.div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={siteLoading ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium">
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center p-8 md:p-12 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl border border-border">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
            Interested in a Similar Project?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Let&apos;s discuss how we can bring your vision to life with the same level of quality
            and attention to detail.
          </p>
          <RegularBtn linkProps={{ href: '/contact' }} className="px-8">
            Start Your Project
          </RegularBtn>
        </motion.div>
      </div>
    </SectionContainer>
  );
};
