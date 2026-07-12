'use client';

import { useState } from 'react';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import type {
  ClientPortfolioCaseStudy,
  IPortfolioCaseStudyCreatePayload,
  IPortfolioCaseStudyUpdatePayload,
} from '@/lib/constants/endpoints';
import type { Paragraph, SectionHeading, LogoDesign } from '@/lib/types/portfolio-case-study';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';

const portfolioSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  client: z.string().min(1, 'Client is required'),
  industry: z.string().min(1, 'Industry is required'),
  slug: z.string().optional(),
  timeline: z.string().optional(),
  services: z.string().optional(),
  typographyPrimary: z.string().optional(),
  typographySecondary: z.string().optional(),
  keywords: z.string().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

type PortfolioSectionsState = {
  aboutClientHeading?: SectionHeading;
  aboutClient?: Paragraph[];
  summary: Paragraph[];
  challengeHeading?: SectionHeading;
  challenge: Paragraph[];
  strategyHeading?: SectionHeading;
  strategy: Paragraph[];
  logoDesignHeading?: SectionHeading;
  logoDesign?: LogoDesign;
  visualIdentityHeading?: SectionHeading;
  identityImages: string[];
  applicationsHeading?: SectionHeading;
  applicationsImages?: string[];
  colorPalette: { name: string; hex: string }[];
  resultsHeading?: SectionHeading;
  results: { label: string; value: string }[];
};

function getCaseStudyId(caseStudy?: ClientPortfolioCaseStudy | null): string {
  return (caseStudy as { _id?: string } | null | undefined)?._id ?? '';
}

function hasHeading(h?: SectionHeading): boolean {
  if (!h) return false;
  return Boolean(
    h.headingTextStart?.trim() || h.headingTextSpecial?.trim() || h.headingTextEnd?.trim()
  );
}

function initSections(caseStudy?: ClientPortfolioCaseStudy | null): PortfolioSectionsState {
  return {
    aboutClientHeading: caseStudy?.aboutClientHeading,
    aboutClient: caseStudy?.aboutClient,
    summary: caseStudy?.summary?.length ? [...caseStudy.summary] : [{ text: '' }],
    challengeHeading: caseStudy?.challengeHeading,
    challenge: caseStudy?.challenge?.length ? [...caseStudy.challenge] : [{ text: '' }],
    strategyHeading: caseStudy?.strategyHeading,
    strategy: caseStudy?.strategy?.length ? [...caseStudy.strategy] : [{ text: '' }],
    logoDesignHeading: caseStudy?.logoDesignHeading,
    logoDesign: caseStudy?.logoDesign ? { ...caseStudy.logoDesign } : undefined,
    visualIdentityHeading: caseStudy?.visualIdentityHeading,
    identityImages: caseStudy?.identityImages ?? [],
    applicationsHeading: caseStudy?.applicationsHeading,
    applicationsImages: caseStudy?.applicationsImages,
    colorPalette: caseStudy?.colorPalette?.length
      ? [...caseStudy.colorPalette]
      : [{ name: '', hex: '#000000' }],
    resultsHeading: caseStudy?.resultsHeading,
    results: caseStudy?.results?.length ? [...caseStudy.results] : [{ label: '', value: '' }],
  };
}

export function emptyPortfolioCaseStudy(): PortfolioFormValues & PortfolioSectionsState {
  return {
    title: '',
    description: '',
    category: '',
    client: '',
    industry: '',
    slug: '',
    timeline: '',
    services: '',
    typographyPrimary: '',
    typographySecondary: '',
    keywords: '',
    featured: false,
    isActive: true,
    summary: [{ text: '' }],
    challenge: [{ text: '' }],
    strategy: [{ text: '' }],
    identityImages: [],
    colorPalette: [{ name: '', hex: '#000000' }],
    results: [{ label: '', value: '' }],
  };
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
  items: Paragraph[];
  onChange: (next: Paragraph[]) => void;
}) {
  const update = (i: number, patch: Partial<Paragraph>) => {
    onChange(items.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  };
  const bulletsStr = (p: Paragraph) => (p.bullets ?? []).join('\n');

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

function cleanLogoDesign(logoDesign?: LogoDesign): LogoDesign | undefined {
  if (!logoDesign) return undefined;

  const hasGrid = Boolean(logoDesign.gridImage?.trim());
  const hasBreakdown = logoDesign.breakdown?.some(
    b =>
      Boolean(b.text?.trim()) ||
      Boolean(b.heading?.trim()) ||
      Boolean(b.inlineHeading?.trim()) ||
      Boolean(b.closing?.trim()) ||
      (b.bullets && b.bullets.length > 0)
  );

  if (!hasGrid && !hasBreakdown) return undefined;

  return logoDesign;
}

interface PortfolioCaseStudyFormProps {
  caseStudy?: ClientPortfolioCaseStudy | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PortfolioCaseStudyForm = ({
  caseStudy,
  onSuccess,
  onCancel,
}: PortfolioCaseStudyFormProps) => {
  const isEditing = !!caseStudy;
  const entityId = getCaseStudyId(caseStudy);

  const [sections, setSections] = useState<PortfolioSectionsState>(() => initSections(caseStudy));
  const setSection = (patch: Partial<PortfolioSectionsState>) =>
    setSections(prev => ({ ...prev, ...patch }));

  const [imageUrl, setImageUrl] = useState(caseStudy?.image ?? '');
  const [heroUrl, setHeroUrl] = useState(caseStudy?.hero ?? '');

  const [pendingCardFile, setPendingCardFile] = useState<File | null>(null);
  const [pendingCardPreview, setPendingCardPreview] = useState<string | null>(null);
  const [pendingHeroFile, setPendingHeroFile] = useState<File | null>(null);
  const [pendingHeroPreview, setPendingHeroPreview] = useState<string | null>(null);
  const [pendingGridFile, setPendingGridFile] = useState<File | null>(null);
  const [pendingGridPreview, setPendingGridPreview] = useState<string | null>(null);

  const cardUpload = useFileUpload({
    entityType: 'portfolio-case-study',
    entityId,
    intent: 'card-image',
    onUploadComplete: url => setImageUrl(url),
  });

  const heroUpload = useFileUpload({
    entityType: 'portfolio-case-study',
    entityId,
    intent: 'image',
    onUploadComplete: url => setHeroUrl(url),
  });

  const gridUpload = useFileUpload({
    entityType: 'portfolio-case-study',
    entityId,
    intent: 'image',
    onUploadComplete: url => {
      setSections(prev => ({
        ...prev,
        logoDesign: prev.logoDesign
          ? { ...prev.logoDesign, gridImage: url }
          : { breakdown: [{ text: '' }], gridImage: url },
      }));
    },
  });

  const handleCardFileSelect = (file: File | null) => {
    if (isEditing && file) {
      cardUpload.handleFileSelect(file);
      cardUpload.uploadFile({ file });
    } else {
      if (pendingCardPreview) URL.revokeObjectURL(pendingCardPreview);
      setPendingCardFile(file);
      setPendingCardPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const handleHeroFileSelect = (file: File | null) => {
    if (isEditing && file) {
      heroUpload.handleFileSelect(file);
      heroUpload.uploadFile({ file });
    } else {
      if (pendingHeroPreview) URL.revokeObjectURL(pendingHeroPreview);
      setPendingHeroFile(file);
      setPendingHeroPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const handleGridFileSelect = (file: File | null) => {
    if (isEditing && file) {
      gridUpload.handleFileSelect(file);
      gridUpload.uploadFile({ file });
    } else {
      if (pendingGridPreview) URL.revokeObjectURL(pendingGridPreview);
      setPendingGridFile(file);
      setPendingGridPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const handleCardClear = () => {
    if (isEditing) cardUpload.clearFile();
    else if (pendingCardPreview) URL.revokeObjectURL(pendingCardPreview);
    setPendingCardFile(null);
    setPendingCardPreview(null);
    setImageUrl('');
  };

  const handleHeroClear = () => {
    if (isEditing) heroUpload.clearFile();
    else if (pendingHeroPreview) URL.revokeObjectURL(pendingHeroPreview);
    setPendingHeroFile(null);
    setPendingHeroPreview(null);
    setHeroUrl('');
  };

  const handleGridClear = () => {
    if (isEditing) gridUpload.clearFile();
    else if (pendingGridPreview) URL.revokeObjectURL(pendingGridPreview);
    setPendingGridFile(null);
    setPendingGridPreview(null);
    setSection({
      logoDesign: sections.logoDesign ? { ...sections.logoDesign, gridImage: '' } : undefined,
    });
  };

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    onChange,
  } = useForm<typeof portfolioSchema>({
    formSchema: portfolioSchema,
    defaultFormValues: {
      title: caseStudy?.title ?? '',
      description: caseStudy?.description ?? '',
      category: caseStudy?.category ?? '',
      client: caseStudy?.client ?? '',
      industry: caseStudy?.industry ?? '',
      slug: caseStudy?.slug ?? '',
      timeline: caseStudy?.timeline ?? '',
      services: caseStudy?.services?.join(', ') ?? '',
      typographyPrimary: caseStudy?.typographyPrimary ?? '',
      typographySecondary: caseStudy?.typographySecondary ?? '',
      keywords: caseStudy?.keywords?.join(', ') ?? '',
      featured: caseStudy?.featured ?? false,
      isActive: caseStudy?.isActive ?? true,
    },
    onSubmit,
  });

  function buildPayload(
    values: PortfolioFormValues,
    cardImage: string,
    heroImage: string,
    gridImage: string
  ): IPortfolioCaseStudyCreatePayload {
    const logoDesign = cleanLogoDesign(
      sections.logoDesign
        ? { ...sections.logoDesign, gridImage: gridImage || sections.logoDesign.gridImage }
        : undefined
    );

    return {
      slug: values.slug?.trim() || undefined,
      title: values.title,
      description: values.description,
      category: values.category,
      client: values.client,
      industry: values.industry,
      image: cardImage,
      hero: heroImage,
      timeline: values.timeline ?? '',
      services: values.services
        ? values.services
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [],
      aboutClientHeading: hasHeading(sections.aboutClientHeading)
        ? sections.aboutClientHeading
        : undefined,
      aboutClient: sections.aboutClient?.length ? sections.aboutClient : undefined,
      summary: sections.summary,
      challengeHeading: hasHeading(sections.challengeHeading)
        ? sections.challengeHeading
        : undefined,
      challenge: sections.challenge,
      strategyHeading: hasHeading(sections.strategyHeading) ? sections.strategyHeading : undefined,
      strategy: sections.strategy,
      logoDesignHeading: hasHeading(sections.logoDesignHeading)
        ? sections.logoDesignHeading
        : undefined,
      logoDesign,
      visualIdentityHeading: hasHeading(sections.visualIdentityHeading)
        ? sections.visualIdentityHeading
        : undefined,
      identityImages: sections.identityImages,
      applicationsHeading: hasHeading(sections.applicationsHeading)
        ? sections.applicationsHeading
        : undefined,
      applicationsImages: sections.applicationsImages?.length
        ? sections.applicationsImages
        : undefined,
      colorPalette: sections.colorPalette,
      typographyPrimary: values.typographyPrimary ?? '',
      typographySecondary: values.typographySecondary ?? '',
      resultsHeading: hasHeading(sections.resultsHeading) ? sections.resultsHeading : undefined,
      results: sections.results,
      keywords: values.keywords
        ? values.keywords
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : [],
      featured: values.featured,
      isActive: values.isActive ?? true,
    };
  }

  async function onSubmit(values: PortfolioFormValues) {
    try {
      const payload = buildPayload(values, imageUrl, heroUrl, sections.logoDesign?.gridImage ?? '');

      if (isEditing) {
        const identifier = caseStudy!.slug || getCaseStudyId(caseStudy);
        const data = await adminCallApiToast(
          'Saving case study…',
          () =>
            callApi('ADMIN_UPDATE_PORTFOLIO_CASE_STUDY', {
              query: `/${identifier}`,
              payload: payload as IPortfolioCaseStudyUpdatePayload,
            }),
          'Case study updated successfully'
        );

        if (!data) {
          setFormErrors({ root: ['Failed to update case study'] });
          return false;
        }
      } else {
        const data = await adminCallApiToast(
          'Creating case study…',
          () =>
            callApi('ADMIN_CREATE_PORTFOLIO_CASE_STUDY', {
              payload,
            }),
          'Case study created successfully'
        );

        if (!data) {
          setFormErrors({ root: ['Failed to create case study'] });
          return false;
        }

        const created = data.caseStudy;
        const createdId = getCaseStudyId(created);
        let finalImage = imageUrl;
        let finalHero = heroUrl;
        let finalGrid = sections.logoDesign?.gridImage ?? '';

        if (pendingCardFile) {
          const result = await cardUpload.uploadFile({
            file: pendingCardFile,
            entityId: createdId,
            intent: 'card-image',
          });
          if (result?.url) finalImage = result.url;
        }

        if (pendingHeroFile) {
          const result = await heroUpload.uploadFile({
            file: pendingHeroFile,
            entityId: createdId,
            intent: 'image',
          });
          if (result?.url) finalHero = result.url;
        }

        if (pendingGridFile) {
          const result = await gridUpload.uploadFile({
            file: pendingGridFile,
            entityId: createdId,
            intent: 'image',
          });
          if (result?.url) finalGrid = result.url;
        }

        if (
          (pendingCardFile && finalImage) ||
          (pendingHeroFile && finalHero) ||
          (pendingGridFile && finalGrid)
        ) {
          const updatePayload: IPortfolioCaseStudyUpdatePayload = {};
          if (pendingCardFile && finalImage) updatePayload.image = finalImage;
          if (pendingHeroFile && finalHero) updatePayload.hero = finalHero;
          if (pendingGridFile && finalGrid && sections.logoDesign) {
            updatePayload.logoDesign = {
              ...sections.logoDesign,
              gridImage: finalGrid,
            };
          }

          const identifier = created.slug || createdId;
          await adminCallApiToast(
            'Updating images…',
            () =>
              callApi('ADMIN_UPDATE_PORTFOLIO_CASE_STUDY', {
                query: `/${identifier}`,
                payload: updatePayload,
              }),
            'Images uploaded successfully'
          );
        }
      }

      onSuccess();
      return true;
    } catch {
      setFormErrors({ root: ['An unexpected error occurred'] });
      return false;
    }
  }

  const identityStr = sections.identityImages.join('\n');
  const applicationsStr = (sections.applicationsImages ?? []).join('\n');

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <Accordion type="multiple" defaultValue={['overview']} className="w-full">
        <AccordionItem value="overview">
          <AccordionTrigger>Overview</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <RegularInput
              label="Title"
              name="title"
              required
              value={formValues.title}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.title : []}
            />
            <RegularInput
              label="Slug"
              name="slug"
              placeholder="auto-generated from title if empty"
              value={formValues.slug}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.slug : []}
            />
            <RegularInput
              label="Category"
              name="category"
              required
              value={formValues.category}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.category : []}
            />
            <RegularTextarea
              label="Description"
              name="description"
              required
              value={formValues.description}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.description : []}
              rows={3}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <RegularInput
                label="Industry"
                name="industry"
                required
                value={formValues.industry}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.industry : []}
              />
              <RegularInput
                label="Client"
                name="client"
                required
                value={formValues.client}
                onChange={handleInputChange}
                errors={errorsVisible ? formErrors.client : []}
              />
            </div>
            <RegularInput
              label="Timeline"
              name="timeline"
              placeholder="e.g. 6 Weeks"
              value={formValues.timeline}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.timeline : []}
            />
            <RegularInput
              label="Services"
              name="services"
              placeholder="Brand Strategy, Logo Design, Visual Identity"
              value={formValues.services}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.services : []}
              subtext="Comma-separated list"
            />

            <ImageUpload
              label="Card image"
              value={imageUrl}
              previewUrl={
                isEditing ? cardUpload.previewUrl || undefined : pendingCardPreview || undefined
              }
              onFileSelect={handleCardFileSelect}
              onClear={handleCardClear}
              uploading={cardUpload.loading}
              progress={cardUpload.progress}
              aspectRatio="4/3"
              placeholder="Upload card image"
              subtext="Thumbnail on portfolio grid"
            />

            <ImageUpload
              label="Hero image"
              value={heroUrl}
              previewUrl={
                isEditing ? heroUpload.previewUrl || undefined : pendingHeroPreview || undefined
              }
              onFileSelect={handleHeroFileSelect}
              onClear={handleHeroClear}
              uploading={heroUpload.loading}
              progress={heroUpload.progress}
              aspectRatio="16/9"
              placeholder="Upload hero image"
              subtext="Large image below title on case study page"
            />

            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-medium text-foreground">Featured</label>
                <p className="text-xs text-muted-foreground">Highlight on the portfolio listing</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formValues.featured}
                onClick={() => onChange('featured', !formValues.featured)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  formValues.featured ? 'bg-primary' : 'bg-input'
                )}>
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
                    formValues.featured ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-medium text-foreground">Active</label>
                <p className="text-xs text-muted-foreground">Visible on the public site</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formValues.isActive}
                onClick={() => onChange('isActive', !formValues.isActive)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  formValues.isActive ? 'bg-primary' : 'bg-input'
                )}>
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
                    formValues.isActive ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about-client">
          <AccordionTrigger>About Client</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <HeadingFields
              label="Section heading (optional)"
              value={sections.aboutClientHeading}
              onChange={aboutClientHeading => setSection({ aboutClientHeading })}
            />
            <ParagraphListEditor
              title="Paragraphs"
              items={sections.aboutClient ?? [{ text: '' }]}
              onChange={aboutClient => setSection({ aboutClient })}
            />
            {sections.aboutClient && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSection({ aboutClient: undefined, aboutClientHeading: undefined })
                }>
                Clear section
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="summary">
          <AccordionTrigger>Summary</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <ParagraphListEditor
              title="Overview paragraphs"
              items={sections.summary}
              onChange={summary => setSection({ summary })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="challenge">
          <AccordionTrigger>Challenge</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <HeadingFields
              label="Section heading (optional)"
              value={sections.challengeHeading}
              onChange={challengeHeading => setSection({ challengeHeading })}
            />
            <ParagraphListEditor
              title="Paragraphs"
              items={sections.challenge}
              onChange={challenge => setSection({ challenge })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="strategy">
          <AccordionTrigger>Strategy</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <HeadingFields
              label="Section heading (optional)"
              value={sections.strategyHeading}
              onChange={strategyHeading => setSection({ strategyHeading })}
            />
            <ParagraphListEditor
              title="Paragraphs"
              items={sections.strategy}
              onChange={strategy => setSection({ strategy })}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="logo">
          <AccordionTrigger>Logo Design</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            {sections.logoDesign ? (
              <>
                <HeadingFields
                  label="Section heading (optional)"
                  value={sections.logoDesignHeading}
                  onChange={logoDesignHeading => setSection({ logoDesignHeading })}
                />
                <ImageUpload
                  label="Grid image"
                  value={sections.logoDesign.gridImage}
                  previewUrl={
                    isEditing ? gridUpload.previewUrl || undefined : pendingGridPreview || undefined
                  }
                  onFileSelect={handleGridFileSelect}
                  onClear={handleGridClear}
                  uploading={gridUpload.loading}
                  progress={gridUpload.progress}
                  aspectRatio="16/9"
                  placeholder="Upload logo grid image"
                />
                <ParagraphListEditor
                  title="Breakdown paragraphs"
                  items={sections.logoDesign.breakdown}
                  onChange={breakdown =>
                    setSection({
                      logoDesign: { ...sections.logoDesign!, breakdown },
                    })
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSection({ logoDesign: undefined, logoDesignHeading: undefined })
                  }>
                  Remove logo section
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSection({
                    logoDesign: { breakdown: [{ text: '' }], gridImage: '' },
                  })
                }>
                <Plus className="size-4 mr-1" /> Add logo section
              </Button>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="visual-identity">
          <AccordionTrigger>Visual Identity</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <HeadingFields
              label="Section heading (optional)"
              value={sections.visualIdentityHeading}
              onChange={visualIdentityHeading => setSection({ visualIdentityHeading })}
            />
            <RegularInput
              label="Typography — primary"
              name="typographyPrimary"
              value={formValues.typographyPrimary}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.typographyPrimary : []}
            />
            <RegularInput
              label="Typography — secondary"
              name="typographySecondary"
              value={formValues.typographySecondary}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.typographySecondary : []}
            />
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSection({
                      colorPalette: [...sections.colorPalette, { name: '', hex: '#000000' }],
                    })
                  }>
                  <Plus className="size-4 mr-1" /> Swatch
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {sections.colorPalette.map((c, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <RegularInput
                      label="Name"
                      name="_"
                      value={c.name}
                      onChange={e => {
                        const next = [...sections.colorPalette];
                        next[i] = { ...next[i], name: e.target.value };
                        setSection({ colorPalette: next });
                      }}
                    />
                    <RegularInput
                      label="Hex"
                      name="_"
                      value={c.hex}
                      onChange={e => {
                        const next = [...sections.colorPalette];
                        next[i] = { ...next[i], hex: e.target.value };
                        setSection({ colorPalette: next });
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSection({
                          colorPalette: sections.colorPalette.filter((_, idx) => idx !== i),
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
                setSection({
                  identityImages: e.target.value
                    .split('\n')
                    .map(s => s.trim())
                    .filter(Boolean),
                })
              }
              rows={4}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="applications">
          <AccordionTrigger>Applications</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            {sections.applicationsImages !== undefined ? (
              <>
                <HeadingFields
                  label="Section heading (optional)"
                  value={sections.applicationsHeading}
                  onChange={applicationsHeading => setSection({ applicationsHeading })}
                />
                <RegularTextarea
                  label="Images (one URL per line)"
                  name="_"
                  value={applicationsStr}
                  onChange={e =>
                    setSection({
                      applicationsImages: e.target.value
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={4}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSection({
                      applicationsImages: undefined,
                      applicationsHeading: undefined,
                    })
                  }>
                  Remove applications section
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSection({ applicationsImages: [] })}>
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
              value={sections.resultsHeading}
              onChange={resultsHeading => setSection({ resultsHeading })}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSection({
                    results: [...sections.results, { label: '', value: '' }],
                  })
                }>
                <Plus className="size-4 mr-1" /> Row
              </Button>
            </div>
            {sections.results.map((r, i) => (
              <div key={i} className="flex gap-2">
                <RegularInput
                  label="Label"
                  name="_"
                  value={r.label}
                  onChange={e => {
                    const next = [...sections.results];
                    next[i] = { ...next[i], label: e.target.value };
                    setSection({ results: next });
                  }}
                />
                <RegularInput
                  label="Value"
                  name="_"
                  value={r.value}
                  onChange={e => {
                    const next = [...sections.results];
                    next[i] = { ...next[i], value: e.target.value };
                    setSection({ results: next });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 mt-6"
                  onClick={() =>
                    setSection({
                      results: sections.results.filter((_, idx) => idx !== i),
                    })
                  }>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seo">
          <AccordionTrigger>SEO / Keywords</AccordionTrigger>
          <AccordionContent className="grid gap-6 pt-2">
            <RegularInput
              label="Keywords"
              name="keywords"
              placeholder="brand design, logo, visual identity"
              value={formValues.keywords}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.keywords : []}
              subtext="Comma-separated list for case study SEO"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3 pt-4 border-t">
        <RegularBtn
          type="button"
          text="Cancel"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        />
        <RegularBtn
          type="submit"
          text={isEditing ? 'Update Case Study' : 'Create Case Study'}
          loading={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
};
