'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion } from 'motion/react';
import { useSiteStore } from '@/lib/store/siteStore';
import { ClientProject } from '@/lib/constants/endpoints';
import {
  ExternalLink,
  Github,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
  AlertCircle,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';

interface ProjectDetailContentProps {
  project: ClientProject;
}

export const ProjectDetailContent = ({ project }: ProjectDetailContentProps) => {
  const { siteLoading } = useSiteStore(state => state);

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Featured Image - Full Width */}
      {project.featuredImage && (
        <SectionContainer customContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-video bg-muted shadow-elegant">
            <img
              src={project.featuredImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </SectionContainer>
      )}

      {/* Video - Full Width */}
      {project.videoUrl && (
        <SectionContainer customContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden aspect-video bg-muted relative">
            <iframe
              src={project.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${project.title} video`}
            />
          </motion.div>
        </SectionContainer>
      )}

      {/* Action Buttons */}
      {(project.projectUrl || project.githubUrl || project.clientWebsite) && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-4">
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
        </SectionContainer>
      )}

      {/* Project Info Cards */}
      {(project.startDate || project.endDate || project.budget || project.category) && (
        <SectionContainer>
          <div className="grid md:grid-cols-2 gap-4">
            {project.startDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                </div>
                <p className="text-foreground font-semibold">{formatDate(project.startDate)}</p>
              </motion.div>
            )}
            {project.endDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                viewport={{ once: true }}
                className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">End Date</span>
                </div>
                <p className="text-foreground font-semibold">{formatDate(project.endDate)}</p>
              </motion.div>
            )}
            {project.budget && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Budget</span>
                </div>
                <p className="text-foreground font-semibold">
                  {project.budget.amount
                    ? `${project.budget.currency || 'USD'} ${project.budget.amount.toLocaleString()}`
                    : project.budget.range || 'Not disclosed'}
                </p>
              </motion.div>
            )}
            {project.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                viewport={{ once: true }}
                className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Category</span>
                </div>
                <p className="text-foreground font-semibold">{project.category}</p>
              </motion.div>
            )}
          </div>
        </SectionContainer>
      )}

      {/* Description */}
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="prose prose-lg max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
            About This Project
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{project.description}</p>
        </motion.div>
      </SectionContainer>

      {/* Challenge */}
      {project.challenge && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            viewport={{ once: true }}
            className="p-6 bg-destructive/5 border-l-4 border-destructive rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                The Challenge
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">{project.challenge}</p>
          </motion.div>
        </SectionContainer>
      )}

      {/* Solution */}
      {project.solution && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 bg-primary/5 border-l-4 border-primary rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                Our Solution
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">{project.solution}</p>
          </motion.div>
        </SectionContainer>
      )}

      {/* Approach */}
      {project.approach && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
              Our Approach
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{project.approach}</p>
          </motion.div>
        </SectionContainer>
      )}

      {/* Metrics */}
      {project.metrics && project.metrics.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                Key Results
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.metrics
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={siteLoading ? {} : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border text-center">
                    {metric.icon && (
                      <div className="text-4xl mb-3 flex justify-center">{metric.icon}</div>
                    )}
                    <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Results */}
      {project.results && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
              Results & Impact
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{project.results}</p>
          </motion.div>
        </SectionContainer>
      )}

      {/* Timeline */}
      {project.timeline && project.timeline.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                Project Timeline
              </h2>
            </div>
            <div className="space-y-4">
              {project.timeline
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{phase.phase}</h3>
                        {phase.status && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              phase.status === 'completed'
                                ? 'bg-green-500/10 text-green-600'
                                : phase.status === 'in-progress'
                                  ? 'bg-blue-500/10 text-blue-600'
                                  : phase.status === 'on-hold'
                                    ? 'bg-yellow-500/10 text-yellow-600'
                                    : 'bg-gray-500/10 text-gray-600'
                            }`}>
                            {phase.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-2">
                        {phase.description}
                      </p>
                      {(phase.startDate || phase.endDate) && (
                        <p className="text-sm text-muted-foreground">
                          {phase.startDate && formatDate(phase.startDate)}
                          {phase.startDate && phase.endDate && ' - '}
                          {phase.endDate && formatDate(phase.endDate)}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Challenges Faced */}
      {project.challengesFaced && project.challengesFaced.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-serif">
              Challenges & Solutions
            </h2>
            <div className="space-y-6">
              {project.challengesFaced
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 bg-muted/30 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      {item.challenge}
                    </h3>
                    <div className="ml-7">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Solution:</p>
                      <p className="text-muted-foreground leading-relaxed">{item.solution}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Lessons Learned */}
      {project.lessonsLearned && project.lessonsLearned.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground font-serif">
                Lessons Learned
              </h2>
            </div>
            <div className="space-y-3">
              {project.lessonsLearned.map((lesson, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground leading-relaxed">{lesson}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            viewport={{ once: true }}>
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
        </SectionContainer>
      )}

      {/* Additional Content Sections */}
      {project.additionalContent && project.additionalContent.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8">
            {project.additionalContent
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="prose prose-lg max-w-none">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-serif">
                    {section.title}
                  </h2>
                  <div
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        section.type === 'html' || section.type === 'markdown'
                          ? section.content
                          : section.content.replace(/\n/g, '<br />'),
                    }}
                  />
                </motion.div>
              ))}
          </motion.div>
        </SectionContainer>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <SectionContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            viewport={{ once: true }}>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </SectionContainer>
      )}

      {/* CTA */}
      <SectionContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={siteLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
      </SectionContainer>
    </>
  );
};
