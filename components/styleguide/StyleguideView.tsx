'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { useSiteStore } from '@/lib/store/siteStore';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { GhostBtn } from '@/components/atoms/GhostBtn';
import {
  SectionHeading,
  sectionCaptionClassName,
  sectionTitleClassName,
} from '@/components/general/SectionHeading';
import { RegularPageHeroSection } from '@/components/general/RegularPageHeroSection';
import { PageHeroSection } from '@/components/general/PageHeroSection';
import { SectionContainer } from '@/components/general/SectionContainer';
import { HeroSection } from '@/components/section/home/HeroSection';
import { ProjectsPreviewSection } from '@/components/section/home/ProjectsPreviewSection';
import { ProjectPreviewCard } from '@/components/section/home/ProjectPreviewCard';
import { WhatWeCreateCard } from '@/components/section/home/WhatWeCreateCard';
import { ProjectCard } from '@/components/section/projects/ProjectCard';
import { ServiceCard } from '@/components/section/services/ServiceCard';
import { TestimonialCard } from '@/components/general/TestimonialCard';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { ProjectDetailHero } from '@/components/section/projects/ProjectDetailHero';
import { ServiceDetailHero } from '@/components/section/services/ServiceDetailHero';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  designColors,
  designRadii,
  designCardMotion,
  designLayout,
  designShadows,
  designSpacing,
  designTypeScale,
  designTypography,
  styleguideNav,
  styleguideSectionIds,
} from '@/lib/design-tokens';
import { useStyleguideScrollspy } from '@/hooks/use-styleguide-scrollspy';
import {
  styleguideBannerProject,
  styleguideCaseStudyProject,
  styleguideListingProject,
  styleguidePreviewProjects,
  styleguideService,
  styleguideWhatWeCreateCards,
} from '@/lib/fixtures/styleguideMocks';
import { cn } from '@/lib/utils';
import { StyleguidePreviewBox, StyleguideSection } from './StyleguideSection';
import { StyleguideFormsDemo } from './StyleguideFormsDemo';

const buttonVariantKeys = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
  'hero',
  'accent',
] as const;

export type StyleguideViewProps = {
  sampleTestimonial: ClientTestimonial;
};

type StyleguideNavItemProps = {
  id: string;
  label: string;
  isActive: boolean;
};

const StyleguideNavItem = ({ id, label, isActive }: StyleguideNavItemProps) => (
  <li>
    <a
      href={`#${id}`}
      aria-current={isActive ? 'location' : undefined}
      className={cn(
        'block rounded-md border-l-2 py-2 pl-3 pr-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive
          ? 'border-primary bg-primary/10 font-medium text-primary'
          : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground'
      )}>
      {label}
    </a>
  </li>
);

export const StyleguideView = ({ sampleTestimonial }: StyleguideViewProps) => {
  const setSiteLoading = useSiteStore(s => s.actions.setSiteLoading);
  const activeSectionId = useStyleguideScrollspy(
    styleguideSectionIds,
    styleguideSectionIds[0] ?? 'foundations'
  );

  useEffect(() => {
    setSiteLoading(false);
  }, [setSiteLoading]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="regular-container py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-1">Internal</p>
            <h1 className="text-xl font-bold font-heading">Crelyst Styleguide</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to site
          </Link>
        </div>
      </header>

      <div className="regular-container py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <nav
            aria-label="Styleguide sections"
            className="hidden lg:block sticky top-24 self-start w-52 shrink-0">
            <ul className="space-y-1 text-sm">
              {styleguideNav.map(item => (
                <StyleguideNavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isActive={activeSectionId === item.id}
                />
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <StyleguideSection
              id="foundations"
              title="Foundations"
              description="Colors, typography, spacing, radius, and shadows from Figma (desktop) and globals.css.">
              <div className="space-y-10">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Colors</h3>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {designColors.map(c => (
                      <div key={c.name} className="rounded-lg border border-border overflow-hidden">
                        <div
                          className="h-16 w-full"
                          style={{ background: `hsl(var(${c.cssVar}))` }}
                        />
                        <div className="p-3 text-sm space-y-1">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-muted-foreground font-mono text-xs">{c.cssVar}</p>
                          <p className="text-muted-foreground text-xs">{c.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Typography families</h3>
                  <div className="grid gap-4">
                    {designTypography.map(t => (
                      <StyleguidePreviewBox key={t.name} label={t.name}>
                        <p className={cn('text-2xl md:text-3xl', t.cssClass)}>{t.sample}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t.family}
                          {'note' in t && t.note ? ` — ${t.note}` : ''}
                        </p>
                      </StyleguidePreviewBox>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Type scale</h3>
                  <div className="space-y-6">
                    {designTypeScale.map(scale => (
                      <div key={scale.label}>
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                          {scale.label}
                        </p>
                        <p className={scale.classes}>
                          {scale.label.includes('Eyebrow') ? 'Project Overview' : 'Sample text'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Spacing & layout</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {designSpacing.map(s => (
                        <li key={s.name}>
                          <code className="text-primary">{s.utility}</code> — {s.note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Radius & shadows</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                      {designRadii.map(r => (
                        <li key={r.name}>
                          <span className="text-foreground">{r.name}</span>
                          {'value' in r && r.value ? ` — ${r.value}` : ''}
                          {'note' in r && r.note ? ` — ${r.note}` : ''}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-4">
                      {designShadows.map(s => (
                        <div
                          key={s.name}
                          className={cn(
                            'w-32 h-20 rounded-xl bg-card border border-border flex items-center justify-center text-xs',
                            s.utility
                          )}>
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="buttons"
              title="Buttons & CTAs"
              description="shadcn button variants, RegularBtn, and patterns used on the homepage and projects section.">
              <div className="space-y-8">
                <StyleguidePreviewBox label="Button variants">
                  <div className="flex flex-wrap gap-3">
                    {buttonVariantKeys.map(v => (
                      <Button key={v} variant={v}>
                        {v}
                      </Button>
                    ))}
                  </div>
                </StyleguidePreviewBox>

                <StyleguidePreviewBox label="Homepage hero CTAs (production)">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <RegularBtn
                      linkProps={{ href: '/contact' }}
                      className="px-8 py-6 text-lg group"
                      RightIcon={ArrowRight}
                      rightIconProps={{
                        className: 'size-5 group-hover:translate-x-1 transition-transform',
                      }}
                      text="Request a Quote"
                    />
                    <GhostBtn
                      linkProps={{ href: '/projects' }}
                      size="none"
                      className="flex items-center gap-3 px-6 py-3 text-foreground hover:text-primary transition-colors group">
                      <span className="w-12 h-12 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                        <Play className="w-5 h-5 ml-0.5" />
                      </span>
                      <span className="font-medium">See Our Work</span>
                    </GhostBtn>
                  </div>
                </StyleguidePreviewBox>

                <StyleguidePreviewBox label="Projects section CTA">
                  <RegularBtn
                    linkProps={{ href: '/projects' }}
                    variant="outline"
                    RightIcon={ArrowRight}
                    rightIconProps={{ className: 'size-4' }}
                    text="View All Projects"
                    className="px-8"
                  />
                </StyleguidePreviewBox>

                <StyleguidePreviewBox label="Utility classes">
                  <div className="flex flex-wrap gap-3">
                    <button type="button" className={buttonVariants({ variant: 'hero' })}>
                      btn-hero variant
                    </button>
                    <button type="button" className="btn-hero px-6 py-3 rounded-[6px]">
                      .btn-hero
                    </button>
                    <button type="button" className="btn-accent px-6 py-3 rounded-[6px]">
                      .btn-accent
                    </button>
                  </div>
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="forms"
              title="Forms"
              description="RegularInput, RegularTextarea, RegularSelect, and PublicFormPanel — used on Contact and Work With Us. File input documented after upload phase.">
              <StyleguideFormsDemo />
            </StyleguideSection>

            <StyleguideSection
              id="headings"
              title="Section headings"
              description="Mono caption + Montserrat title — used on homepage sections and about pages.">
              <div className="space-y-12">
                <StyleguidePreviewBox label="Centered (portfolio block)">
                  <SectionHeading
                    immediate
                    caption="Portfolio"
                    title="Our Creative Work"
                    text="Discover how we've helped brands express their unique personality through powerful visuals and storytelling"
                    spacing="none"
                  />
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Left-aligned (about preview)">
                  <SectionHeading
                    immediate
                    caption="Why Choose Us"
                    title={
                      <>
                        We Transform Vision into{' '}
                        <span className="text-primary">Digital Success</span>
                      </>
                    }
                    align="start"
                    spacing="none"
                  />
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Primitives">
                  <div className={cn('flex items-center gap-3', 'justify-start')}>
                    <span
                      aria-hidden
                      className={cn('block h-1 w-[50px] rounded-full', 'bg-primary')}
                    />
                    <p className={cn(sectionCaptionClassName, 'text-primary')}>Section caption</p>
                  </div>
                  <p className={cn(sectionTitleClassName, 'text-foreground')}>Section title</p>
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="page-heroes"
              title="Page heroes (listing / marketing)"
              description="Regular page hero template for About/contact/listing pages (excluding homepage and dynamic detail heroes).">
              <div className="space-y-8">
                <StyleguidePreviewBox
                  label="Regular page hero template"
                  className="p-0 overflow-hidden">
                  <RegularPageHeroSection
                    immediate
                    backgroundImage="/images/bg-hero-2.jpg"
                    badge="Crafting Legacies"
                    title={
                      <>
                        Where Creativity Meets
                        <br />
                        Vision
                      </>
                    }
                    description="We are a full-service design and branding agency specializing in photography, brand design, product design, packaging, and visual identity."
                  />
                </StyleguidePreviewBox>
                <StyleguidePreviewBox
                  label="Legacy PageHeroSection (gradient + pattern)"
                  className="p-0 overflow-hidden">
                  <PageHeroSection
                    immediate
                    badge="About"
                    title="Who We Are"
                    description="A full-service design and branding agency."
                    titleFont="body"
                  />
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="detail-heroes"
              title="Detail page heroes"
              description="Project and service single-page headers.">
              <div className="space-y-8">
                <StyleguidePreviewBox
                  label="Project — case study layout"
                  className="p-0 overflow-hidden">
                  <ProjectDetailHero project={styleguideCaseStudyProject} />
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Project — banner hero" className="p-0 overflow-hidden">
                  <ProjectDetailHero project={styleguideBannerProject} />
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Service detail hero" className="p-0 overflow-hidden">
                  <ServiceDetailHero service={styleguideService} />
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="cards"
              title="Cards"
              description="Listing cards, homepage overlay previews, and What We Create service cards. Hover uses shared utilities in globals.css — lift on the shell, slow image scale, neutral scrims (no primary wash or brightness crush).">
              <div className="space-y-10">
                <StyleguidePreviewBox label="Card hover utilities">
                  <ul className="space-y-3 text-sm text-muted-foreground max-w-3xl">
                    {designCardMotion.map(item => (
                      <li key={item.utility}>
                        <code className="text-xs text-primary font-mono">{item.utility}</code>
                        <span className="text-foreground/90"> — {item.note}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted-foreground max-w-3xl">
                    Parent link must include <code className="text-primary">group</code>. Overlay
                    cards pair <code className="text-primary">card-overlay-scrim</code> with{' '}
                    <code className="text-primary">card-overlay-scrim-deepen</code> on hover — never
                    <code className="text-primary"> brightness-*</code>, primary tints, or scrim
                    opacity jumps that hide the artwork.
                  </p>
                </StyleguidePreviewBox>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    What We Create — Figma landing cards
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                    Image card with bottom gradient, orange eyebrow, and white title. Hover: card
                    lift, 1.06 image scale (1.2s), scrim deepen, slight content nudge — wide +
                    standard pair as on Crelyst Landing Page (Desktop).
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] md:gap-5 max-w-5xl">
                    {styleguideWhatWeCreateCards.map((entry, index) => (
                      <WhatWeCreateCard
                        key={entry.service.slug}
                        service={entry.service}
                        index={index}
                        eyebrow={entry.eyebrow}
                        layout={entry.layout}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Project listing card
                  </h3>
                  <div className="max-w-sm">
                    <ProjectCard project={styleguideListingProject} index={0} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Service listing card
                  </h3>
                  <div className="max-w-sm">
                    <ServiceCard service={styleguideService} index={0} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                    Homepage preview cards
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
                    Full-bleed project tiles: neutral bottom scrim, title shifts to primary on
                    hover. Image stays visible — no orange overlay or heavy dimming.
                  </p>
                  <div className="layout-grid-cards">
                    <ProjectPreviewCard
                      project={styleguidePreviewProjects[0]!}
                      index={0}
                      featured
                    />
                    <ProjectPreviewCard project={styleguidePreviewProjects[1]!} index={1} />
                  </div>
                </div>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="testimonials"
              title="Testimonial / feedback card"
              description="Compact client feedback card (~26rem): italic time ago + stars, quote body, client row with logo. Live Firestore sample when available.">
              <div className="space-y-8">
                <StyleguidePreviewBox label="TestimonialCard (live data)">
                  <div className="flex justify-center">
                    <TestimonialCard testimonial={sampleTestimonial} static />
                  </div>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Source:{' '}
                    {sampleTestimonial._id.startsWith('styleguide-')
                      ? 'fixture fallback (no active testimonials in Firestore)'
                      : `Firestore — ${sampleTestimonial.clientName}`}
                  </p>
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Interaction (hover / focus context)">
                  <p className="mb-4 text-sm text-muted-foreground max-w-2xl">
                    Homepage slider uses the same card (static in the slider; hover lift in
                    previews). Manual prev/next only — no autoplay. Motion respects{' '}
                    <code className="text-primary">prefers-reduced-motion</code>.
                  </p>
                  <div className="flex justify-center">
                    <TestimonialCard testimonial={sampleTestimonial} />
                  </div>
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="homepage"
              title="Homepage patterns (frozen)"
              description="Production HeroSection and ProjectsPreviewSection — do not restyle without explicit approval.">
              <div className="space-y-8">
                <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 text-sm text-foreground/90">
                  Production reference — homepage hero and projects grid structure must remain
                  unchanged on the live site.
                </div>
                <StyleguidePreviewBox label="HeroSection" className="p-0 overflow-hidden">
                  <div className="relative border-b border-border">
                    <HeroSection />
                  </div>
                </StyleguidePreviewBox>
                <StyleguidePreviewBox
                  label="ProjectsPreviewSection"
                  className="p-0 overflow-hidden">
                  <ProjectsPreviewSection projects={styleguidePreviewProjects} />
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>

            <StyleguideSection
              id="layout"
              title="Layout"
              description="Three tiers: shell (regular-container), focus/lead (heroes), prose (reading). Shell caps at 1536px on 4xl+ viewports with generous side margins on ultrawide monitors.">
              <div className="space-y-8">
                <StyleguidePreviewBox label="Layout tokens">
                  <ul className="space-y-3 text-sm text-muted-foreground max-w-3xl">
                    {designLayout.map(item => (
                      <li key={item.utility}>
                        <code className="text-xs text-primary font-mono">{item.utility}</code>
                        <span className="text-foreground/90"> — {item.note}</span>
                      </li>
                    ))}
                  </ul>
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Shell (regular-container)">
                  <div className="regular-container rounded-lg border border-dashed border-primary/40 bg-primary/5 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                      Outer box = shell max-width + gutters. On 2500px+ displays, content stays
                      centered with intentional whitespace.
                    </p>
                  </div>
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="Reading measure">
                  <div className="regular-container space-y-4 rounded-lg border border-border bg-muted/20 py-6">
                    <p className="content-focus-center text-center font-heading text-xl font-bold">
                      content-focus-center — hero block
                    </p>
                    <p className="content-prose-center text-muted-foreground">
                      content-prose-center — section intros and long copy (~65–75 characters per
                      line). Use inside the shell, not instead of it.
                    </p>
                  </div>
                </StyleguidePreviewBox>
                <StyleguidePreviewBox label="SectionContainer">
                  <SectionContainer className="!py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                    <p className="text-center text-muted-foreground text-sm">
                      section-padding + regular-container (default). Use fullWidth for edge-to-edge
                      galleries only.
                    </p>
                  </SectionContainer>
                </StyleguidePreviewBox>
              </div>
            </StyleguideSection>
          </div>
        </div>
      </div>
    </div>
  );
};
