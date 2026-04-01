'use client';

import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type {
  CaseStudyParagraph,
  CaseStudyParagraphSection,
  ProjectCaseStudy,
  SectionHeading,
} from '@/lib/types/project-case-study';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function emptyProjectCaseStudy(): ProjectCaseStudy {
  return {
    industry: '',
    services: [],
    engagementTimeline: '',
    summary: { paragraphs: [{ text: '' }] },
    challenge: { paragraphs: [{ text: '' }] },
    strategy: { paragraphs: [{ text: '' }] },
    visualIdentity: {
      identityImages: [],
      colorPalette: [{ name: '', hex: '#000000' }],
      typographyPrimary: '',
      typographySecondary: '',
    },
    results: { metrics: [{ label: '', value: '' }] },
    keywords: [],
  };
}

export function cloneProjectCaseStudy(cs: ProjectCaseStudy): ProjectCaseStudy {
  return JSON.parse(JSON.stringify(cs)) as ProjectCaseStudy;
}

function HeadingFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: SectionHeading;
  onChange: (h: SectionHeading | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="grid gap-6 sm:grid-cols-3">
        <RegularInput
          label="Start"
          name="_"
          value={value?.headingTextStart ?? ''}
          onChange={e =>
            onChange({
              ...value,
              headingTextStart: e.target.value,
              headingTextSpecial: value?.headingTextSpecial,
              headingTextEnd: value?.headingTextEnd,
            })
          }
        />
        <RegularInput
          label="Accent"
          name="_"
          value={value?.headingTextSpecial ?? ''}
          onChange={e =>
            onChange({
              ...value,
              headingTextStart: value?.headingTextStart,
              headingTextSpecial: e.target.value,
              headingTextEnd: value?.headingTextEnd,
            })
          }
        />
        <RegularInput
          label="End"
          name="_"
          value={value?.headingTextEnd ?? ''}
          onChange={e =>
            onChange({
              ...value,
              headingTextStart: value?.headingTextStart,
              headingTextSpecial: value?.headingTextSpecial,
              headingTextEnd: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

function ParagraphListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: CaseStudyParagraph[];
  onChange: (next: CaseStudyParagraph[]) => void;
}) {
  const update = (i: number, patch: Partial<CaseStudyParagraph>) => {
    onChange(items.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };
  const bulletsStr = (p: CaseStudyParagraph) => (p.bullets ?? []).join('\n');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, { text: '' }])}>
          <Plus className="size-4 mr-1" /> Add block
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((p, i) => (
          <div key={i} className="rounded-lg border border-border p-3 grid gap-6 relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 size-8"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <X className="size-4" />
            </Button>
            <RegularInput
              label="Heading (optional)"
              name="_"
              value={p.heading ?? ''}
              onChange={e => update(i, { heading: e.target.value })}
            />
            <RegularInput
              label="Inline heading"
              name="_"
              value={p.inlineHeading ?? ''}
              onChange={e => update(i, { inlineHeading: e.target.value })}
            />
            <RegularTextarea
              label="Body text"
              name="_"
              value={p.text ?? ''}
              onChange={e => update(i, { text: e.target.value })}
              rows={3}
            />
            <RegularTextarea
              label="Bullets (one per line)"
              name="_"
              value={bulletsStr(p)}
              onChange={e =>
                update(i, {
                  bullets: e.target.value
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean),
                })
              }
              rows={2}
            />
            <RegularInput
              label="Closing (optional)"
              name="_"
              value={p.closing ?? ''}
              onChange={e => update(i, { closing: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ParagraphSectionEditor({
  title,
  section,
  onChange,
  showClear,
  onClear,
}: {
  title: string;
  section: CaseStudyParagraphSection | undefined;
  onChange: (s: CaseStudyParagraphSection) => void;
  showClear?: boolean;
  onClear?: () => void;
}) {
  const s = section ?? { paragraphs: [{ text: '' }] };
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        {showClear && onClear && (
          <Button type="button" variant="outline" size="sm" onClick={onClear}>
            Clear section
          </Button>
        )}
      </div>
      <HeadingFields
        label="Section heading (optional)"
        value={s.heading}
        onChange={h => onChange({ ...s, heading: h })}
      />
      <ParagraphListEditor
        title="Paragraphs"
        items={s.paragraphs}
        onChange={paragraphs => onChange({ ...s, paragraphs })}
      />
    </div>
  );
}

interface ProjectCaseStudyFormSectionProps {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  caseStudy: ProjectCaseStudy;
  onCaseStudyChange: (cs: ProjectCaseStudy) => void;
}

export function ProjectCaseStudyFormSection({
  enabled,
  onEnabledChange,
  caseStudy,
  onCaseStudyChange,
}: ProjectCaseStudyFormSectionProps) {
  const set = (patch: Partial<ProjectCaseStudy>) => onCaseStudyChange({ ...caseStudy, ...patch });

  const servicesStr = caseStudy.services.join(', ');
  const identityStr = caseStudy.visualIdentity.identityImages.join('\n');
  const applicationsStr = (caseStudy.applications?.images ?? []).join('\n');
  const keywordsStr = caseStudy.keywords.join(', ');
  const vi = caseStudy.visualIdentity;

  return (
    <div className="grid gap-8 border-t pt-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-foreground">Case study page</label>
          <p className="text-xs text-muted-foreground">
            Bold layout: overview, challenge, strategy, identity, applications, results
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onEnabledChange(!enabled)}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            enabled ? 'bg-primary' : 'bg-input'
          )}>
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {enabled && (
        <Accordion type="multiple" defaultValue={['basics', 'story']} className="w-full">
          <AccordionItem value="basics">
            <AccordionTrigger>Basics</AccordionTrigger>
            <AccordionContent className="grid gap-6 pt-2">
              <RegularInput
                label="Industry"
                name="_"
                value={caseStudy.industry}
                onChange={e => set({ industry: e.target.value })}
              />
              <RegularInput
                label="Engagement timeline"
                name="_"
                placeholder="e.g. 6 Weeks"
                value={caseStudy.engagementTimeline}
                onChange={e => set({ engagementTimeline: e.target.value })}
              />
              <RegularTextarea
                label="Services (comma-separated)"
                name="_"
                value={servicesStr}
                onChange={e =>
                  set({
                    services: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={2}
              />
              <RegularTextarea
                label="Case study keywords (comma-separated)"
                name="_"
                value={keywordsStr}
                onChange={e =>
                  set({
                    keywords: e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean),
                  })
                }
                rows={2}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="story">
            <AccordionTrigger>Story sections</AccordionTrigger>
            <AccordionContent className="grid gap-8 pt-2">
              <ParagraphSectionEditor
                title="About the client (optional)"
                section={caseStudy.aboutClient}
                onChange={aboutClient => set({ aboutClient })}
                showClear={!!caseStudy.aboutClient}
                onClear={() => set({ aboutClient: undefined })}
              />
              <ParagraphSectionEditor
                title="Summary / overview"
                section={caseStudy.summary}
                onChange={summary => set({ summary })}
              />
              <ParagraphSectionEditor
                title="Challenge"
                section={caseStudy.challenge}
                onChange={challenge => set({ challenge })}
              />
              <ParagraphSectionEditor
                title="Strategy"
                section={caseStudy.strategy}
                onChange={strategy => set({ strategy })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="logo">
            <AccordionTrigger>Logo breakdown</AccordionTrigger>
            <AccordionContent className="grid gap-6 pt-2">
              {caseStudy.logoDesign ? (
                <>
                  <HeadingFields
                    label="Logo section heading (optional)"
                    value={caseStudy.logoDesign.heading}
                    onChange={h =>
                      set({
                        logoDesign: { ...caseStudy.logoDesign!, heading: h },
                      })
                    }
                  />
                  <RegularInput
                    label="Grid image URL"
                    name="_"
                    value={caseStudy.logoDesign.gridImage}
                    onChange={e =>
                      set({
                        logoDesign: {
                          ...caseStudy.logoDesign!,
                          gridImage: e.target.value,
                        },
                      })
                    }
                  />
                  <ParagraphListEditor
                    title="Breakdown paragraphs"
                    items={caseStudy.logoDesign.breakdown}
                    onChange={breakdown =>
                      set({
                        logoDesign: {
                          ...caseStudy.logoDesign!,
                          breakdown,
                        },
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => set({ logoDesign: undefined })}>
                    Remove logo section
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    set({
                      logoDesign: {
                        breakdown: [{ text: '' }],
                        gridImage: '',
                      },
                    })
                  }>
                  <Plus className="size-4 mr-1" /> Add logo section
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="visual">
            <AccordionTrigger>Visual identity</AccordionTrigger>
            <AccordionContent className="grid gap-6 pt-2">
              <HeadingFields
                label="Section heading (optional)"
                value={vi.heading}
                onChange={h => set({ visualIdentity: { ...vi, heading: h } })}
              />
              <RegularInput
                label="Typography — primary"
                name="_"
                value={vi.typographyPrimary}
                onChange={e =>
                  set({ visualIdentity: { ...vi, typographyPrimary: e.target.value } })
                }
              />
              <RegularInput
                label="Typography — secondary"
                name="_"
                value={vi.typographySecondary}
                onChange={e =>
                  set({ visualIdentity: { ...vi, typographySecondary: e.target.value } })
                }
              />
              <div className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      set({
                        visualIdentity: {
                          ...vi,
                          colorPalette: [...vi.colorPalette, { name: '', hex: '#000000' }],
                        },
                      })
                    }>
                    <Plus className="size-4 mr-1" /> Swatch
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {vi.colorPalette.map((c, i) => (
                    <div key={i} className="flex gap-2 items-end">
                      <RegularInput
                        label="Name"
                        name="_"
                        value={c.name}
                        onChange={e => {
                          const next = [...vi.colorPalette];
                          next[i] = { ...next[i], name: e.target.value };
                          set({ visualIdentity: { ...vi, colorPalette: next } });
                        }}
                      />
                      <RegularInput
                        label="Hex"
                        name="_"
                        value={c.hex}
                        onChange={e => {
                          const next = [...vi.colorPalette];
                          next[i] = { ...next[i], hex: e.target.value };
                          set({ visualIdentity: { ...vi, colorPalette: next } });
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          set({
                            visualIdentity: {
                              ...vi,
                              colorPalette: vi.colorPalette.filter((_, idx) => idx !== i),
                            },
                          })
                        }>
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <RegularTextarea
                label="Identity images (one URL per line)"
                name="_"
                value={identityStr}
                onChange={e =>
                  set({
                    visualIdentity: {
                      ...vi,
                      identityImages: e.target.value
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean),
                    },
                  })
                }
                rows={4}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="applications">
            <AccordionTrigger>Applications</AccordionTrigger>
            <AccordionContent className="grid gap-6 pt-2">
              {caseStudy.applications ? (
                <>
                  <HeadingFields
                    label="Section heading (optional)"
                    value={caseStudy.applications.heading}
                    onChange={h =>
                      set({
                        applications: { ...caseStudy.applications!, heading: h },
                      })
                    }
                  />
                  <RegularTextarea
                    label="Images (one URL per line)"
                    name="_"
                    value={applicationsStr}
                    onChange={e =>
                      set({
                        applications: {
                          ...caseStudy.applications!,
                          images: e.target.value
                            .split('\n')
                            .map(s => s.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    rows={4}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => set({ applications: undefined })}>
                    Remove applications section
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set({ applications: { images: [] } })}>
                  <Plus className="size-4 mr-1" /> Add applications section
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="results">
            <AccordionTrigger>Results</AccordionTrigger>
            <AccordionContent className="grid gap-6 pt-2">
              <HeadingFields
                label="Section heading (optional)"
                value={caseStudy.results.heading}
                onChange={h => set({ results: { ...caseStudy.results, heading: h } })}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    set({
                      results: {
                        ...caseStudy.results,
                        metrics: [...caseStudy.results.metrics, { label: '', value: '' }],
                      },
                    })
                  }>
                  <Plus className="size-4 mr-1" /> Row
                </Button>
              </div>
              {caseStudy.results.metrics.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <RegularInput
                    label="Label"
                    name="_"
                    value={r.label}
                    onChange={e => {
                      const next = [...caseStudy.results.metrics];
                      next[i] = { ...next[i], label: e.target.value };
                      set({ results: { ...caseStudy.results, metrics: next } });
                    }}
                  />
                  <RegularInput
                    label="Value"
                    name="_"
                    value={r.value}
                    onChange={e => {
                      const next = [...caseStudy.results.metrics];
                      next[i] = { ...next[i], value: e.target.value };
                      set({ results: { ...caseStudy.results, metrics: next } });
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 mt-6"
                    onClick={() =>
                      set({
                        results: {
                          ...caseStudy.results,
                          metrics: caseStudy.results.metrics.filter((_, idx) => idx !== i),
                        },
                      })
                    }>
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
