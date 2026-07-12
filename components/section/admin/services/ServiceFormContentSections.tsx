'use client';

import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { ClientService } from '@/lib/constants/endpoints';
import type {
  IServiceExpertise,
  IServicePackagePricing,
  IServicePricingFooter,
  IServiceWhatMakesUsUnique,
} from '@/app/_server/lib/types/constants';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ServiceContentFormState = {
  pageTitle: string;
  gallery: string[];
  expertise: IServiceExpertise | null;
  breakdownSummary: string[];
  whatMakesUsUnique: IServiceWhatMakesUsUnique | null;
  process: NonNullable<ClientService['process']>;
  benefits: string[];
  packagePricing: IServicePackagePricing[];
  pricingFooter: IServicePricingFooter | null;
  faq: NonNullable<ClientService['faq']>;
  tags: string[];
  imageUrl: string;
};

export type PackagePricingErrors = {
  categoryErrors: { categoryIndex: number }[];
  packageErrors: {
    categoryIndex: number;
    packageIndex: number;
    field: 'packageId' | 'priceRange';
  }[];
};

/**
 * A category/package that's missing an id or price range gets silently dropped by
 * buildExtendedPayload's filter on submit — this surfaces those cases as validation
 * errors instead, so the form can block submission and explain why.
 */
export function getPackagePricingErrors(
  packagePricing: IServicePackagePricing[]
): PackagePricingErrors {
  const categoryErrors: PackagePricingErrors['categoryErrors'] = [];
  const packageErrors: PackagePricingErrors['packageErrors'] = [];

  packagePricing.forEach((category, categoryIndex) => {
    if (!category.id.trim()) {
      categoryErrors.push({ categoryIndex });
    }
    category.packages.forEach((pkg, packageIndex) => {
      if (!pkg.id.trim()) {
        packageErrors.push({ categoryIndex, packageIndex, field: 'packageId' });
      }
      if (pkg.priceRange.length === 0) {
        packageErrors.push({ categoryIndex, packageIndex, field: 'priceRange' });
      }
    });
  });

  return { categoryErrors, packageErrors };
}

export function describePackagePricingErrors(errors: PackagePricingErrors): string[] {
  const messages: string[] = [];

  errors.categoryErrors.forEach(({ categoryIndex }) => {
    messages.push(`Pricing category ${categoryIndex + 1} needs a category id`);
  });
  errors.packageErrors.forEach(({ categoryIndex, packageIndex, field }) => {
    const label = `Pricing category ${categoryIndex + 1}, package ${packageIndex + 1}`;
    messages.push(
      field === 'packageId' ? `${label} needs a package id` : `${label} needs at least one price`
    );
  });

  return messages;
}

export function getInitialServiceContentState(
  service?: ClientService | null
): ServiceContentFormState {
  return {
    pageTitle: service?.pageTitle ?? '',
    gallery: service?.gallery ? [...service.gallery] : [],
    expertise: service?.expertise ? JSON.parse(JSON.stringify(service.expertise)) : null,
    breakdownSummary: service?.breakdownSummary ? [...service.breakdownSummary] : [],
    whatMakesUsUnique: service?.whatMakesUsUnique
      ? JSON.parse(JSON.stringify(service.whatMakesUsUnique))
      : null,
    process: service?.process ? [...service.process] : [],
    benefits: service?.benefits ? [...service.benefits] : [],
    packagePricing: service?.packagePricing
      ? JSON.parse(JSON.stringify(service.packagePricing))
      : [],
    pricingFooter: service?.pricingFooter
      ? JSON.parse(JSON.stringify(service.pricingFooter))
      : null,
    faq: service?.faq ? [...service.faq] : [],
    tags: service?.tags ? [...service.tags] : [],
    imageUrl: service?.image ?? '',
  };
}

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ''])}>
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={e => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
              className={cn(
                'h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm',
                'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onChange(items.filter((_, i) => i !== index))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

type ServiceFormContentSectionsProps = {
  state: ServiceContentFormState;
  onChange: (patch: Partial<ServiceContentFormState>) => void;
  isEditing: boolean;
  serviceId?: string;
  imageUpload: {
    previewUrl?: string | null;
    uploading: boolean;
    progress: number;
    onFileSelect: (file: File | null) => void;
    onClear: () => void;
  };
  pricingErrors: PackagePricingErrors;
  showPricingErrors: boolean;
};

export function ServiceFormContentSections({
  state,
  onChange,
  isEditing,
  imageUpload,
  pricingErrors,
  showPricingErrors,
}: ServiceFormContentSectionsProps) {
  const expertise = state.expertise;
  const unique = state.whatMakesUsUnique;

  const categoryHasError = (categoryIndex: number) =>
    showPricingErrors && pricingErrors.categoryErrors.some(e => e.categoryIndex === categoryIndex);
  const packageFieldErrors = (
    categoryIndex: number,
    packageIndex: number,
    field: 'packageId' | 'priceRange'
  ) =>
    showPricingErrors &&
    pricingErrors.packageErrors.some(
      e => e.categoryIndex === categoryIndex && e.packageIndex === packageIndex && e.field === field
    );

  return (
    <Accordion type="multiple" defaultValue={['content', 'gallery', 'pricing']} className="w-full">
      <AccordionItem value="content">
        <AccordionTrigger>Content</AccordionTrigger>
        <AccordionContent className="grid gap-6 pt-2">
          <RegularInput
            label="Page title"
            name="pageTitle"
            value={state.pageTitle}
            onChange={e => onChange({ pageTitle: e.target.value })}
            placeholder="Hero headline on the public service page"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expertise section</span>
              {!expertise ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onChange({
                      expertise: {
                        title: '',
                        breakdown: [{ title: '', services: [''] }],
                      },
                    })
                  }>
                  <Plus className="mr-1 size-4" /> Add expertise
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({ expertise: null })}>
                  Remove
                </Button>
              )}
            </div>
            {expertise ? (
              <div className="grid gap-4 rounded-lg border border-border p-4">
                <RegularInput
                  label="Section title"
                  name="_"
                  value={expertise.title}
                  onChange={e => onChange({ expertise: { ...expertise, title: e.target.value } })}
                />
                <RegularInput
                  label="Marquee text"
                  name="_"
                  value={expertise.marqueeText ?? ''}
                  onChange={e =>
                    onChange({ expertise: { ...expertise, marqueeText: e.target.value } })
                  }
                />
                {expertise.breakdown.map((group, gi) => (
                  <div key={gi} className="grid gap-3 rounded-md border border-border/60 p-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Group {gi + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                          onChange({
                            expertise: {
                              ...expertise,
                              breakdown: expertise.breakdown.filter((_, i) => i !== gi),
                            },
                          })
                        }>
                        <X className="size-4" />
                      </Button>
                    </div>
                    <RegularInput
                      label="Group title"
                      name="_"
                      value={group.title}
                      onChange={e => {
                        const breakdown = [...expertise.breakdown];
                        breakdown[gi] = { ...breakdown[gi], title: e.target.value };
                        onChange({ expertise: { ...expertise, breakdown } });
                      }}
                    />
                    <StringListEditor
                      label="Services"
                      items={group.services}
                      onChange={services => {
                        const breakdown = [...expertise.breakdown];
                        breakdown[gi] = { ...breakdown[gi], services };
                        onChange({ expertise: { ...expertise, breakdown } });
                      }}
                      placeholder="Service name"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onChange({
                      expertise: {
                        ...expertise,
                        breakdown: [...expertise.breakdown, { title: '', services: [''] }],
                      },
                    })
                  }>
                  <Plus className="mr-1 size-4" /> Add group
                </Button>
              </div>
            ) : null}
          </div>

          <StringListEditor
            label="Breakdown summary tags"
            items={state.breakdownSummary}
            onChange={breakdownSummary => onChange({ breakdownSummary })}
            placeholder="e.g. Professional logo design"
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">What makes us unique</span>
              {!unique ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onChange({
                      whatMakesUsUnique: { title: '', groups: [{ title: '', text: '' }] },
                    })
                  }>
                  <Plus className="mr-1 size-4" /> Add section
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({ whatMakesUsUnique: null })}>
                  Remove
                </Button>
              )}
            </div>
            {unique ? (
              <div className="grid gap-4 rounded-lg border border-border p-4">
                <RegularInput
                  label="Section title"
                  name="_"
                  value={unique.title}
                  onChange={e =>
                    onChange({ whatMakesUsUnique: { ...unique, title: e.target.value } })
                  }
                />
                {unique.groups.map((group, gi) => (
                  <div key={gi} className="grid gap-3 rounded-md border border-border/60 p-3">
                    <RegularInput
                      label="Card title"
                      name="_"
                      value={group.title}
                      onChange={e => {
                        const groups = [...unique.groups];
                        groups[gi] = { ...groups[gi], title: e.target.value };
                        onChange({ whatMakesUsUnique: { ...unique, groups } });
                      }}
                    />
                    <RegularTextarea
                      label="Card text"
                      name="_"
                      rows={3}
                      value={group.text}
                      onChange={e => {
                        const groups = [...unique.groups];
                        groups[gi] = { ...groups[gi], text: e.target.value };
                        onChange({ whatMakesUsUnique: { ...unique, groups } });
                      }}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onChange({
                      whatMakesUsUnique: {
                        ...unique,
                        groups: [...unique.groups, { title: '', text: '' }],
                      },
                    })
                  }>
                  <Plus className="mr-1 size-4" /> Add card
                </Button>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Process steps</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    process: [
                      ...state.process,
                      { title: '', description: '', order: state.process.length },
                    ],
                  })
                }>
                <Plus className="mr-1 size-4" /> Add step
              </Button>
            </div>
            {state.process.map((step, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border p-3">
                <RegularInput
                  label="Step title"
                  name="_"
                  value={step.title}
                  onChange={e => {
                    const process = [...state.process];
                    process[index] = { ...process[index], title: e.target.value };
                    onChange({ process });
                  }}
                />
                <RegularTextarea
                  label="Step description"
                  name="_"
                  rows={2}
                  value={step.description}
                  onChange={e => {
                    const process = [...state.process];
                    process[index] = { ...process[index], description: e.target.value };
                    onChange({ process });
                  }}
                />
              </div>
            ))}
          </div>

          <StringListEditor
            label="Benefits"
            items={state.benefits}
            onChange={benefits => onChange({ benefits })}
            placeholder="Benefit"
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gallery">
        <AccordionTrigger>Gallery & image</AccordionTrigger>
        <AccordionContent className="grid gap-6 pt-2">
          <ImageUpload
            label="Service image"
            value={state.imageUrl}
            previewUrl={isEditing ? imageUpload.previewUrl || undefined : undefined}
            onFileSelect={imageUpload.onFileSelect}
            onClear={imageUpload.onClear}
            uploading={imageUpload.uploading}
            progress={imageUpload.progress}
            aspectRatio="16/9"
            placeholder="Upload service image"
            subtext="Optional image used on the service page"
          />
          <StringListEditor
            label="Gallery image URLs"
            items={state.gallery}
            onChange={gallery => onChange({ gallery })}
            placeholder="https://..."
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pricing">
        <AccordionTrigger>Pricing & FAQ</AccordionTrigger>
        <AccordionContent className="grid gap-6 pt-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Package pricing categories</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    packagePricing: [
                      ...state.packagePricing,
                      { id: '', packages: [{ id: '', priceRange: [0], benefits: [''] }] },
                    ],
                  })
                }>
                <Plus className="mr-1 size-4" /> Add category
              </Button>
            </div>
            {state.packagePricing.map((category, ci) => (
              <div key={ci} className="grid gap-4 rounded-lg border border-border p-4">
                <RegularInput
                  label="Category id"
                  name="_"
                  value={category.id}
                  onChange={e => {
                    const packagePricing = [...state.packagePricing];
                    packagePricing[ci] = { ...packagePricing[ci], id: e.target.value };
                    onChange({ packagePricing });
                  }}
                  placeholder="e.g. branding"
                  errors={categoryHasError(ci) ? ['Category id is required'] : []}
                />
                <RegularInput
                  label="Category title (optional)"
                  name="_"
                  value={category.title ?? ''}
                  onChange={e => {
                    const packagePricing = [...state.packagePricing];
                    packagePricing[ci] = { ...packagePricing[ci], title: e.target.value };
                    onChange({ packagePricing });
                  }}
                  placeholder="Scope of Packaging Design & Pricing"
                />
                {category.packages.map((pkg, pi) => (
                  <div key={pi} className="grid gap-3 rounded-md border border-border/60 p-3">
                    <RegularInput
                      label="Package id"
                      name="_"
                      value={pkg.id}
                      onChange={e => {
                        const packagePricing = [...state.packagePricing];
                        const packages = [...packagePricing[ci].packages];
                        packages[pi] = { ...packages[pi], id: e.target.value };
                        packagePricing[ci] = { ...packagePricing[ci], packages };
                        onChange({ packagePricing });
                      }}
                      placeholder="e.g. basic"
                      errors={
                        packageFieldErrors(ci, pi, 'packageId') ? ['Package id is required'] : []
                      }
                    />
                    <RegularInput
                      label="Package title (optional)"
                      name="_"
                      value={pkg.title ?? ''}
                      onChange={e => {
                        const packagePricing = [...state.packagePricing];
                        const packages = [...packagePricing[ci].packages];
                        packages[pi] = { ...packages[pi], title: e.target.value };
                        packagePricing[ci] = { ...packagePricing[ci], packages };
                        onChange({ packagePricing });
                      }}
                      placeholder="Label Design"
                    />
                    <RegularTextarea
                      label="Package summary (optional)"
                      name="_"
                      rows={2}
                      value={pkg.summary ?? ''}
                      onChange={e => {
                        const packagePricing = [...state.packagePricing];
                        const packages = [...packagePricing[ci].packages];
                        packages[pi] = { ...packages[pi], summary: e.target.value };
                        packagePricing[ci] = { ...packagePricing[ci], packages };
                        onChange({ packagePricing });
                      }}
                      placeholder="For bottles, jars, pouches, cans, and containers."
                    />
                    <RegularInput
                      label="Price range (comma-separated Naira amounts)"
                      name="_"
                      value={pkg.priceRange.join(', ')}
                      onChange={e => {
                        const priceRange = e.target.value
                          .split(',')
                          .map(v => Number(v.trim()))
                          .filter(n => !Number.isNaN(n));
                        const packagePricing = [...state.packagePricing];
                        const packages = [...packagePricing[ci].packages];
                        packages[pi] = { ...packages[pi], priceRange };
                        packagePricing[ci] = { ...packagePricing[ci], packages };
                        onChange({ packagePricing });
                      }}
                      placeholder="500000, 1000000"
                      errors={
                        packageFieldErrors(ci, pi, 'priceRange')
                          ? ['At least one price is required']
                          : []
                      }
                    />
                    <StringListEditor
                      label="Package benefits"
                      items={pkg.benefits}
                      onChange={benefits => {
                        const packagePricing = [...state.packagePricing];
                        const packages = [...packagePricing[ci].packages];
                        packages[pi] = { ...packages[pi], benefits };
                        packagePricing[ci] = { ...packagePricing[ci], packages };
                        onChange({ packagePricing });
                      }}
                    />
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={pkg.isFeatured === true}
                        onChange={e => {
                          const packagePricing = [...state.packagePricing];
                          const packages = [...packagePricing[ci].packages];
                          packages[pi] = {
                            ...packages[pi],
                            isFeatured: e.target.checked ? true : undefined,
                          };
                          packagePricing[ci] = { ...packagePricing[ci], packages };
                          onChange({ packagePricing });
                        }}
                      />
                      Mark as featured (Popular badge)
                    </label>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const packagePricing = [...state.packagePricing];
                    packagePricing[ci] = {
                      ...packagePricing[ci],
                      packages: [
                        ...packagePricing[ci].packages,
                        { id: '', priceRange: [0], benefits: [''] },
                      ],
                    };
                    onChange({ packagePricing });
                  }}>
                  <Plus className="mr-1 size-4" /> Add package
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pricing footer (optional)</span>
              {!state.pricingFooter ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onChange({
                      pricingFooter: {
                        title: '',
                        description: '',
                        ctaLabel: 'Get in touch',
                        ctaHref: '/contact',
                      },
                    })
                  }>
                  <Plus className="mr-1 size-4" /> Add footer
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange({ pricingFooter: null })}>
                  Remove
                </Button>
              )}
            </div>
            {state.pricingFooter ? (
              <div className="grid gap-4 rounded-lg border border-border p-4">
                <RegularInput
                  label="Footer title"
                  name="_"
                  value={state.pricingFooter.title}
                  onChange={e =>
                    onChange({
                      pricingFooter: { ...state.pricingFooter!, title: e.target.value },
                    })
                  }
                />
                <RegularTextarea
                  label="Footer description"
                  name="_"
                  rows={3}
                  value={state.pricingFooter.description}
                  onChange={e =>
                    onChange({
                      pricingFooter: { ...state.pricingFooter!, description: e.target.value },
                    })
                  }
                />
                <RegularInput
                  label="CTA label"
                  name="_"
                  value={state.pricingFooter.ctaLabel ?? ''}
                  onChange={e =>
                    onChange({
                      pricingFooter: { ...state.pricingFooter!, ctaLabel: e.target.value },
                    })
                  }
                />
                <RegularInput
                  label="CTA href"
                  name="_"
                  value={state.pricingFooter.ctaHref ?? ''}
                  onChange={e =>
                    onChange({
                      pricingFooter: { ...state.pricingFooter!, ctaHref: e.target.value },
                    })
                  }
                  placeholder="/contact"
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">FAQ entries</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({
                    faq: [...state.faq, { question: '', answer: '', order: state.faq.length }],
                  })
                }>
                <Plus className="mr-1 size-4" /> Add FAQ
              </Button>
            </div>
            {state.faq.map((item, index) => (
              <div key={index} className="grid gap-3 rounded-lg border border-border p-3">
                <RegularInput
                  label="Question"
                  name="_"
                  value={item.question}
                  onChange={e => {
                    const faq = [...state.faq];
                    faq[index] = { ...faq[index], question: e.target.value };
                    onChange({ faq });
                  }}
                />
                <RegularTextarea
                  label="Answer"
                  name="_"
                  rows={3}
                  value={item.answer}
                  onChange={e => {
                    const faq = [...state.faq];
                    faq[index] = { ...faq[index], answer: e.target.value };
                    onChange({ faq });
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="meta">
        <AccordionTrigger>Meta</AccordionTrigger>
        <AccordionContent className="grid gap-6 pt-2">
          <StringListEditor
            label="Tags"
            items={state.tags}
            onChange={tags => onChange({ tags })}
            placeholder="Tag"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
