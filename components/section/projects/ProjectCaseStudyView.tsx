'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClientProject } from '@/lib/constants/endpoints';
import type { CaseStudyParagraph, SectionHeading } from '@/lib/types/project-case-study';
import type { AdjacentProjectNav } from '@/lib/ssr/adjacentPublishedProjects';
import { useSiteStore } from '@/lib/store/siteStore';
import { cn } from '@/lib/utils';

function DynamicHeading({
  heading,
  defaultStart,
  defaultSpecial,
  defaultEnd = '',
  className,
}: {
  heading?: SectionHeading;
  defaultStart: string;
  defaultSpecial: string;
  defaultEnd?: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-3xl font-serif',
        className
      )}>
      {heading?.headingTextStart ?? defaultStart}
      <span className="text-primary">{heading?.headingTextSpecial ?? defaultSpecial}</span>
      {heading?.headingTextEnd ?? defaultEnd}
    </h2>
  );
}

function ParagraphBlock({
  paragraphs,
  className = '',
}: {
  paragraphs: CaseStudyParagraph[];
  className?: string;
}) {
  return (
    <div className={cn('grid gap-6', className)}>
      {paragraphs.map((p, i) => (
        <div key={i}>
          {p.heading && <h3 className="text-xl font-bold mb-3 font-serif">{p.heading}</h3>}
          {(p.inlineHeading || p.text) && (
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              {p.inlineHeading && (
                <span className="font-semibold text-foreground mr-2">{p.inlineHeading}</span>
              )}
              {p.text}
            </p>
          )}
          {p.bullets && p.bullets.length > 0 && (
            <ul className="list-disc list-outside ml-6 mt-4 grid gap-2 text-muted-foreground text-lg font-light">
              {p.bullets.map((bullet, idx) => (
                <li key={idx} className="pl-2">
                  {bullet}
                </li>
              ))}
            </ul>
          )}
          {p.closing && (
            <p className="text-muted-foreground text-lg leading-relaxed font-light mt-4">
              {p.closing}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function Section({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { siteLoading } = useSiteStore(s => s);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={siteLoading ? {} : inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface ProjectCaseStudyViewProps {
  project: ClientProject;
  /** Prev / next among published projects (same order as public list). */
  adjacent?: { prev: AdjacentProjectNav | null; next: AdjacentProjectNav | null };
}

export function ProjectCaseStudyView({ project, adjacent }: ProjectCaseStudyViewProps) {
  const cs = project.caseStudy;
  if (!cs) return null;

  const client = project.clientName ?? '';
  const servicesLine = cs.services.join(', ');
  const about = cs.aboutClient;
  const vi = cs.visualIdentity;
  const apps = cs.applications;

  return (
    <>
      <section className="py-16 md:py-24">
        <SectionContainer>
          <Section>
            <div className="grid md:grid-cols-4 gap-8 mb-16 border-b border-border pb-16">
              {[
                { label: 'Client', value: client },
                { label: 'Industry', value: cs.industry },
                { label: 'Services', value: servicesLine },
                { label: 'Timeline', value: cs.engagementTimeline },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-primary text-xs tracking-[0.2em] uppercase mb-2 font-medium">
                    {item.label}
                  </p>
                  <p className="text-foreground font-light">{item.value}</p>
                </div>
              ))}
            </div>
          </Section>

          {about && about.paragraphs.length > 0 && (
            <Section>
              <div className="max-w-3xl mb-16">
                <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                  About the Client
                </p>
                <DynamicHeading
                  heading={about.heading}
                  defaultStart="Who we "
                  defaultSpecial="Worked With"
                  className="text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-3xl font-serif"
                />
                <ParagraphBlock paragraphs={about.paragraphs} />
              </div>
            </Section>
          )}

          <Section>
            <div className="max-w-3xl">
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                Project Overview
              </p>
              {(cs.summary.heading?.headingTextStart ||
                cs.summary.heading?.headingTextSpecial ||
                cs.summary.heading?.headingTextEnd) && (
                <DynamicHeading
                  heading={cs.summary.heading}
                  defaultStart="Project "
                  defaultSpecial="Overview"
                  className="text-3xl md:text-5xl font-bold leading-tight mb-8 max-w-3xl font-serif"
                />
              )}
              <ParagraphBlock paragraphs={cs.summary.paragraphs} />
            </div>
          </Section>
        </SectionContainer>
      </section>

      <section className="py-16 md:py-24 bg-muted/40">
        <SectionContainer>
          <Section>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">The Challenge</p>
            <DynamicHeading
              heading={cs.challenge.heading}
              defaultStart="Identifying the "
              defaultSpecial="Brand Gap"
            />
            <ParagraphBlock paragraphs={cs.challenge.paragraphs} className="max-w-3xl" />
          </Section>
        </SectionContainer>
      </section>

      <section className="py-16 md:py-24">
        <SectionContainer>
          <Section>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">The Strategy</p>
            <DynamicHeading
              heading={cs.strategy.heading}
              defaultStart="Strategic "
              defaultSpecial="Direction"
            />
            <ParagraphBlock paragraphs={cs.strategy.paragraphs} className="max-w-3xl" />
          </Section>
        </SectionContainer>
      </section>

      {cs.logoDesign && (
        <section className="py-16 md:py-24 bg-muted/40">
          <SectionContainer>
            <Section>
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Logo Design</p>
              <DynamicHeading
                heading={cs.logoDesign.heading}
                defaultStart="Mark "
                defaultSpecial="Construction"
              />
            </Section>

            <div className="grid lg:grid-cols-2 gap-16 items-center mt-8">
              <Section>
                <ParagraphBlock paragraphs={cs.logoDesign.breakdown} />
              </Section>
              <Section delay={0.15}>
                <div className="rounded-xl overflow-hidden border border-border">
                  <img
                    src={cs.logoDesign.gridImage}
                    alt="Logo construction"
                    className="w-full object-cover"
                  />
                </div>
              </Section>
            </div>
          </SectionContainer>
        </section>
      )}

      <section className="py-16 md:py-24">
        <SectionContainer>
          <Section>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Visual Identity</p>
            <DynamicHeading
              heading={vi.heading}
              defaultStart="Identity "
              defaultSpecial="System"
              className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl font-serif"
            />
          </Section>

          <Section>
            <p className="text-foreground text-sm tracking-[0.2em] uppercase mb-6">Color Palette</p>
            <div className="flex flex-wrap gap-4 mb-16">
              {vi.colorPalette.map(color => (
                <div key={`${color.hex}-${color.name}`} className="group">
                  <div
                    className="w-24 h-24 rounded-lg border border-border mb-3 transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-foreground text-xs font-medium">{color.name}</p>
                  <p className="text-muted-foreground text-xs">{color.hex}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section>
            <p className="text-foreground text-sm tracking-[0.2em] uppercase mb-6">
              Typography System
            </p>
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="border border-border rounded-xl p-8">
                <p className="text-primary text-xs tracking-[0.2em] uppercase mb-3">
                  Primary — Headlines
                </p>
                <p className="font-serif text-4xl font-bold">{vi.typographyPrimary}</p>
                <p className="font-serif text-xl text-muted-foreground mt-2">
                  Aa Bb Cc Dd Ee Ff Gg
                </p>
              </div>
              <div className="border border-border rounded-xl p-8">
                <p className="text-primary text-xs tracking-[0.2em] uppercase mb-3">
                  Secondary — Body
                </p>
                <p className="text-4xl font-bold">{vi.typographySecondary}</p>
                <p className="text-xl text-muted-foreground mt-2">Aa Bb Cc Dd Ee Ff Gg</p>
              </div>
            </div>
          </Section>
        </SectionContainer>

        <div className="w-full flex flex-col">
          {vi.identityImages.map((img, idx) => (
            <Section key={idx}>
              <img
                src={img}
                alt={`Visual identity ${idx + 1}`}
                className="w-full h-auto object-cover"
              />
            </Section>
          ))}
        </div>
      </section>

      {apps && apps.images.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/40">
          <SectionContainer customContainer className="mb-16">
            <Section>
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Applications</p>
              <DynamicHeading
                heading={apps.heading}
                defaultStart="Brand in "
                defaultSpecial="Context"
                className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl font-serif"
              />
            </Section>
          </SectionContainer>

          <div className="w-full flex flex-col">
            {apps.images.map((img, idx) => (
              <Section key={idx}>
                <img
                  src={img}
                  alt={`Brand application ${idx + 1}`}
                  className="w-full h-auto object-cover"
                />
              </Section>
            ))}
          </div>
        </section>
      )}

      {cs.results.metrics.length > 0 && (
        <section className="py-16 md:py-24">
          <SectionContainer>
            <Section>
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">
                Results & Impact
              </p>
              <DynamicHeading
                heading={cs.results.heading}
                defaultStart="Measurable "
                defaultSpecial="Impact"
                className="text-3xl md:text-5xl font-bold leading-tight mb-16 max-w-3xl font-serif"
              />
            </Section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {cs.results.metrics.map((r, i) => (
                <Section key={r.label} delay={i * 0.1}>
                  <div className="border border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors duration-300">
                    <p className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
                      {r.value}
                    </p>
                    <p className="text-muted-foreground text-sm">{r.label}</p>
                  </div>
                </Section>
              ))}
            </div>
          </SectionContainer>
        </section>
      )}

      {adjacent && (adjacent.prev || adjacent.next) && (
        <section className="py-12 md:py-16 border-t border-border bg-muted/20">
          <SectionContainer>
            <div className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-4">
              {adjacent.prev ? (
                <Link
                  href={`/projects/${encodeURIComponent(adjacent.prev.slug)}`}
                  className="group flex flex-1 items-center gap-3 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/40 hover:bg-muted/30">
                  <ChevronLeft className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0 text-left">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Previous
                    </p>
                    <p className="font-serif text-lg font-semibold truncate group-hover:text-primary transition-colors">
                      {adjacent.prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block flex-1" aria-hidden />
              )}
              {adjacent.next ? (
                <Link
                  href={`/projects/${encodeURIComponent(adjacent.next.slug)}`}
                  className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-border bg-background px-5 py-4 transition-colors hover:border-primary/40 hover:bg-muted/30 sm:text-right">
                  <div className="min-w-0 sm:order-1 text-right sm:text-right">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Next
                    </p>
                    <p className="font-serif text-lg font-semibold truncate group-hover:text-primary transition-colors">
                      {adjacent.next.title}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-primary sm:order-2" aria-hidden />
                </Link>
              ) : null}
            </div>
          </SectionContainer>
        </section>
      )}
    </>
  );
}
