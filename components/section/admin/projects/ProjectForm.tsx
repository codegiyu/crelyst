'use client';

import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientProject } from '@/lib/constants/endpoints';
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { PROJECT_STATUSES, ProjectStatus } from '@/app/_server/lib/types/constants';
import { formatDateForInput } from '@/lib/utils/general';
import type { ProjectCaseStudy } from '@/lib/types/project-case-study';
import {
  ProjectCaseStudyFormSection,
  cloneProjectCaseStudy,
  emptyProjectCaseStudy,
} from './ProjectCaseStudyFormSection';
import { projectStatusSchema } from '@/app/_server/lib/validation/projectStatus';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  category: z.string().optional(),
  status: projectStatusSchema.optional(),
  clientName: z.string().optional(),
  clientWebsite: z.url('Invalid URL').optional().or(z.literal('')),
  projectUrl: z.url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.url('Invalid URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  // SEO fields
  seoMetaTitle: z.string().max(100, 'Meta title is too long').optional(),
  seoMetaDescription: z.string().max(300, 'Meta description is too long').optional(),
  seoKeywords: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: ClientProject | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const statusOptions = PROJECT_STATUSES.map(status => ({
  value: status,
  text: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
}));

export const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
  const isEditing = !!project;
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || []);
  const [newTechnology, setNewTechnology] = useState('');
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [newTag, setNewTag] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>(project?.images ?? []);
  const [newGalleryImage, setNewGalleryImage] = useState('');
  // For new projects: toggle to use featured image as card image
  const [useFeaturedAsCard, setUseFeaturedAsCard] = useState(!isEditing);

  // Pending uploads for creation flow
  const [pendingFeaturedFile, setPendingFeaturedFile] = useState<File | null>(null);
  const [pendingFeaturedPreview, setPendingFeaturedPreview] = useState<string | null>(null);
  const [pendingCardFile, setPendingCardFile] = useState<File | null>(null);
  const [pendingCardPreview, setPendingCardPreview] = useState<string | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [pendingBannerPreview, setPendingBannerPreview] = useState<string | null>(null);
  const [pendingHeroFile, setPendingHeroFile] = useState<File | null>(null);
  const [pendingHeroPreview, setPendingHeroPreview] = useState<string | null>(null);

  // Image URLs (from server or after upload)
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>(project?.featuredImage || '');
  const [cardImageUrl, setCardImageUrl] = useState<string>(project?.cardImage || '');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>(project?.bannerImage || '');
  const [heroImageUrl, setHeroImageUrl] = useState<string>(project?.heroImage || '');

  const [caseStudyEnabled, setCaseStudyEnabled] = useState(!!project?.caseStudy);
  const [caseStudy, setCaseStudy] = useState<ProjectCaseStudy>(() =>
    project?.caseStudy ? cloneProjectCaseStudy(project.caseStudy) : emptyProjectCaseStudy()
  );

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    onChange,
  } = useForm<typeof projectSchema>({
    formSchema: projectSchema,
    defaultFormValues: {
      title: project?.title || '',
      description: project?.description || '',
      shortDescription: project?.shortDescription || '',
      category: project?.category || '',
      status: project?.status || 'draft',
      clientName: project?.clientName || '',
      clientWebsite: project?.clientWebsite || '',
      projectUrl: project?.projectUrl || '',
      githubUrl: project?.githubUrl || '',
      startDate: formatDateForInput(project?.startDate),
      endDate: formatDateForInput(project?.endDate),
      isFeatured: project?.isFeatured ?? false,
      isActive: project?.isActive ?? true,
      seoMetaTitle: project?.seo?.metaTitle || '',
      seoMetaDescription: project?.seo?.metaDescription || '',
      seoKeywords: project?.seo?.keywords?.join(', ') || '',
    },
    onSubmit,
  });

  // Upload hooks for editing mode (immediate upload)
  const featuredUpload = useFileUpload({
    entityType: 'project',
    entityId: project?._id || '',
    intent: 'image',
    onUploadComplete: url => {
      setFeaturedImageUrl(url);
    },
  });

  const cardUpload = useFileUpload({
    entityType: 'project',
    entityId: project?._id || '',
    intent: 'card-image',
    onUploadComplete: url => {
      setCardImageUrl(url);
    },
  });

  const bannerUpload = useFileUpload({
    entityType: 'project',
    entityId: project?._id || '',
    intent: 'banner-image',
    onUploadComplete: url => {
      setBannerImageUrl(url);
    },
  });

  const heroUpload = useFileUpload({
    entityType: 'project',
    entityId: project?._id || '',
    intent: 'image',
    onUploadComplete: url => {
      setHeroImageUrl(url);
    },
  });

  // Handle featured file selection
  const handleFeaturedFileSelect = (file: File | null) => {
    if (isEditing && file) {
      featuredUpload.handleFileSelect(file);
      featuredUpload.uploadFile({ file });
    } else {
      if (pendingFeaturedPreview) {
        URL.revokeObjectURL(pendingFeaturedPreview);
      }
      setPendingFeaturedFile(file);
      setPendingFeaturedPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  // Handle card file selection
  const handleCardFileSelect = (file: File | null) => {
    if (isEditing && file) {
      cardUpload.handleFileSelect(file);
      cardUpload.uploadFile({ file });
    } else {
      if (pendingCardPreview) {
        URL.revokeObjectURL(pendingCardPreview);
      }
      setPendingCardFile(file);
      setPendingCardPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  // Handle banner file selection
  const handleBannerFileSelect = (file: File | null) => {
    if (isEditing && file) {
      bannerUpload.handleFileSelect(file);
      bannerUpload.uploadFile({ file });
    } else {
      if (pendingBannerPreview) {
        URL.revokeObjectURL(pendingBannerPreview);
      }
      setPendingBannerFile(file);
      setPendingBannerPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  // Clear handlers
  const handleFeaturedClear = () => {
    if (isEditing) {
      featuredUpload.clearFile();
    } else if (pendingFeaturedPreview) {
      URL.revokeObjectURL(pendingFeaturedPreview);
    }
    setPendingFeaturedFile(null);
    setPendingFeaturedPreview(null);
    setFeaturedImageUrl('');
  };

  const handleCardClear = () => {
    if (isEditing) {
      cardUpload.clearFile();
    } else if (pendingCardPreview) {
      URL.revokeObjectURL(pendingCardPreview);
    }
    setPendingCardFile(null);
    setPendingCardPreview(null);
    setCardImageUrl('');
  };

  const handleBannerClear = () => {
    if (isEditing) {
      bannerUpload.clearFile();
    } else if (pendingBannerPreview) {
      URL.revokeObjectURL(pendingBannerPreview);
    }
    setPendingBannerFile(null);
    setPendingBannerPreview(null);
    setBannerImageUrl('');
  };

  const handleHeroFileSelect = (file: File | null) => {
    if (isEditing && file) {
      heroUpload.handleFileSelect(file);
      heroUpload.uploadFile({ file });
    } else {
      if (pendingHeroPreview) {
        URL.revokeObjectURL(pendingHeroPreview);
      }
      setPendingHeroFile(file);
      setPendingHeroPreview(file ? URL.createObjectURL(file) : null);
    }
  };

  const handleHeroClear = () => {
    if (isEditing) {
      heroUpload.clearFile();
    } else if (pendingHeroPreview) {
      URL.revokeObjectURL(pendingHeroPreview);
    }
    setPendingHeroFile(null);
    setPendingHeroPreview(null);
    setHeroImageUrl('');
  };

  const caseStudyPayload = (): ProjectCaseStudy | undefined | null => {
    if (caseStudyEnabled) {
      const cs = JSON.parse(JSON.stringify(caseStudy)) as ProjectCaseStudy;
      if (cs.logoDesign) {
        const hasGrid = Boolean(cs.logoDesign.gridImage?.trim());
        const hasBreakdown = cs.logoDesign.breakdown?.some(
          b =>
            Boolean(b.text?.trim()) ||
            Boolean(b.heading?.trim()) ||
            Boolean(b.inlineHeading?.trim()) ||
            Boolean(b.closing?.trim()) ||
            (b.bullets && b.bullets.length > 0)
        );
        if (!hasGrid && !hasBreakdown) delete cs.logoDesign;
      }
      return cs;
    }
    if (isEditing && project?.caseStudy) return null;
    return undefined;
  };

  async function onSubmit(values: ProjectFormValues) {
    try {
      // Build SEO object
      const seo = {
        metaTitle: values.seoMetaTitle || undefined,
        metaDescription: values.seoMetaDescription || undefined,
        keywords: values.seoKeywords
          ? values.seoKeywords
              .split(',')
              .map(k => k.trim())
              .filter(Boolean)
          : undefined,
      };

      if (isEditing) {
        // Update existing project
        const cs = caseStudyPayload();
        const payload = {
          title: values.title,
          description: values.description,
          shortDescription: values.shortDescription,
          category: values.category,
          status: (values.status || 'draft') as ProjectStatus,
          clientName: values.clientName,
          clientWebsite: values.clientWebsite || undefined,
          projectUrl: values.projectUrl || undefined,
          githubUrl: values.githubUrl || undefined,
          startDate: values.startDate || undefined,
          endDate: values.endDate || undefined,
          featuredImage: featuredImageUrl || undefined,
          cardImage: cardImageUrl || undefined,
          bannerImage: bannerImageUrl || undefined,
          heroImage: heroImageUrl || undefined,
          isFeatured: values.isFeatured,
          isActive: values.isActive ?? true,
          technologies,
          tags: tags.length ? tags : undefined,
          images: galleryImages.map(url => url.trim()).filter(Boolean),
          ...(cs === null ? { caseStudy: null } : cs ? { caseStudy: cs } : {}),
          seo,
        };

        const identifier = project.slug || project._id;
        const { data, error } = await callApi('ADMIN_UPDATE_PROJECT', {
          query: `/${identifier}`,
          payload,
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update project'] });
          return false;
        }

        toast.success('Project updated successfully');
      } else {
        // Create new project first (without images)
        const csCreate = caseStudyPayload();
        const payload = {
          title: values.title,
          description: values.description,
          shortDescription: values.shortDescription,
          category: values.category,
          status: (values.status || 'draft') as ProjectStatus,
          clientName: values.clientName,
          clientWebsite: values.clientWebsite || undefined,
          projectUrl: values.projectUrl || undefined,
          githubUrl: values.githubUrl || undefined,
          startDate: values.startDate || undefined,
          endDate: values.endDate || undefined,
          isFeatured: values.isFeatured,
          isActive: values.isActive ?? true,
          technologies,
          tags: tags.length ? tags : undefined,
          images: galleryImages.map(url => url.trim()).filter(Boolean),
          ...(csCreate && csCreate !== null ? { caseStudy: csCreate } : {}),
          seo,
        };

        const { data, error } = await callApi('ADMIN_CREATE_PROJECT', {
          payload,
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to create project'] });
          return false;
        }

        const createdProject = data.project;
        let finalFeaturedUrl = '';
        let finalCardUrl = '';
        let finalBannerUrl = '';
        let finalHeroUrl = '';

        // Now upload pending images with the real project ID
        if (pendingFeaturedFile) {
          toast.info('Uploading featured image...');
          const result = await featuredUpload.uploadFile({
            file: pendingFeaturedFile,
            entityId: createdProject._id,
            intent: 'image',
          });
          if (result?.url) {
            finalFeaturedUrl = result.url;
          }
        }

        if (!useFeaturedAsCard && pendingCardFile) {
          toast.info('Uploading card image...');
          const result = await cardUpload.uploadFile({
            file: pendingCardFile,
            entityId: createdProject._id,
            intent: 'card-image',
          });
          if (result?.url) {
            finalCardUrl = result.url;
          }
        } else if (useFeaturedAsCard && finalFeaturedUrl) {
          finalCardUrl = finalFeaturedUrl;
        }

        if (pendingBannerFile) {
          toast.info('Uploading banner image...');
          const result = await bannerUpload.uploadFile({
            file: pendingBannerFile,
            entityId: createdProject._id,
            intent: 'banner-image',
          });
          if (result?.url) {
            finalBannerUrl = result.url;
          }
        }

        if (pendingHeroFile) {
          toast.info('Uploading hero image...');
          const result = await heroUpload.uploadFile({
            file: pendingHeroFile,
            entityId: createdProject._id,
            intent: 'image',
          });
          if (result?.url) {
            finalHeroUrl = result.url;
          }
        }

        // Update project with image URLs if we uploaded any
        if (finalFeaturedUrl || finalCardUrl || finalBannerUrl || finalHeroUrl) {
          const updatePayload: Record<string, string> = {};
          if (finalFeaturedUrl) updatePayload.featuredImage = finalFeaturedUrl;
          if (finalCardUrl) updatePayload.cardImage = finalCardUrl;
          if (finalBannerUrl) updatePayload.bannerImage = finalBannerUrl;
          if (finalHeroUrl) updatePayload.heroImage = finalHeroUrl;

          const identifier = createdProject.slug || createdProject._id;
          await callApi('ADMIN_UPDATE_PROJECT', {
            query: `/${identifier}`,
            payload: updatePayload,
          });
        }

        toast.success('Project created successfully');
      }

      onSuccess();
      return true;
    } catch {
      setFormErrors({ root: ['An unexpected error occurred'] });
      return false;
    }
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies([...technologies, newTechnology.trim()]);
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setGalleryImages([...galleryImages, newGalleryImage.trim()]);
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <div className="grid gap-6">
        {/* Basic Info */}
        <RegularInput
          label="Title"
          name="title"
          required
          placeholder="e.g., E-commerce Platform"
          value={formValues.title}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.title : []}
        />

        <RegularTextarea
          label="Description"
          name="description"
          required
          placeholder="Describe this project in detail..."
          value={formValues.description}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.description : []}
          rows={4}
        />

        <RegularTextarea
          label="Short Description"
          name="shortDescription"
          placeholder="A brief summary for cards and previews..."
          value={formValues.shortDescription}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.shortDescription : []}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-6">
          <RegularInput
            label="Category"
            name="category"
            placeholder="e.g., Web Application"
            value={formValues.category}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.category : []}
          />

          <RegularSelect
            label="Status"
            name="status"
            value={formValues.status || 'draft'}
            onSelectChange={value => {
              const status = value as ProjectStatus;
              onChange('status', status);
              if (status === 'draft' || status === 'archived' || status === 'cancelled') {
                onChange('isActive', false);
              }
            }}
            options={statusOptions}
            errors={errorsVisible ? formErrors.status : []}
            subtext="Display label only. Active controls whether the project appears on the public site."
          />
        </div>
        {(formValues.status === 'draft' ||
          formValues.status === 'archived' ||
          formValues.status === 'cancelled') && (
          <p className="text-xs text-muted-foreground -mt-4">
            Draft, archived, and cancelled projects are hidden from the public site by default. You
            can still turn Active on for teaser use cases.
          </p>
        )}

        {/* Client Info */}
        <div className="grid grid-cols-2 gap-6">
          <RegularInput
            label="Client Name"
            name="clientName"
            placeholder="e.g., Acme Corp"
            value={formValues.clientName}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.clientName : []}
          />

          <RegularInput
            label="Client Website"
            name="clientWebsite"
            placeholder="https://example.com"
            value={formValues.clientWebsite}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.clientWebsite : []}
          />
        </div>

        {/* Project Links */}
        <div className="grid grid-cols-2 gap-6">
          <RegularInput
            label="Project URL"
            name="projectUrl"
            placeholder="https://project-demo.com"
            value={formValues.projectUrl}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.projectUrl : []}
          />

          <RegularInput
            label="GitHub URL"
            name="githubUrl"
            placeholder="https://github.com/..."
            value={formValues.githubUrl}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.githubUrl : []}
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6">
          <RegularInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formValues.startDate}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.startDate : []}
          />

          <RegularInput
            label="End Date"
            name="endDate"
            type="date"
            value={formValues.endDate}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.endDate : []}
          />
        </div>

        {/* Featured Image */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
              Featured Image
            </span>
            {!isEditing && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={useFeaturedAsCard}
                  onChange={e => setUseFeaturedAsCard(e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                Also use as card image
              </label>
            )}
          </div>
          <ImageUpload
            value={featuredImageUrl}
            previewUrl={
              isEditing
                ? featuredUpload.previewUrl || undefined
                : pendingFeaturedPreview || undefined
            }
            onFileSelect={handleFeaturedFileSelect}
            onClear={handleFeaturedClear}
            uploading={featuredUpload.loading}
            progress={featuredUpload.progress}
            aspectRatio="16/9"
            placeholder="Upload featured image"
            subtext="Main image displayed on project detail page"
          />
        </div>

        {/* Card Image - Show if editing OR if not using featured as card */}
        {(isEditing || !useFeaturedAsCard) && (
          <ImageUpload
            label="Card Image"
            value={cardImageUrl}
            previewUrl={
              isEditing ? cardUpload.previewUrl || undefined : pendingCardPreview || undefined
            }
            onFileSelect={handleCardFileSelect}
            onClear={handleCardClear}
            uploading={cardUpload.loading}
            progress={cardUpload.progress}
            aspectRatio="4/3"
            placeholder="Upload card image"
            subtext="Smaller image displayed on project cards and previews"
          />
        )}

        {/* Banner Image */}
        <ImageUpload
          label="Banner Image"
          value={bannerImageUrl}
          previewUrl={
            isEditing ? bannerUpload.previewUrl || undefined : pendingBannerPreview || undefined
          }
          onFileSelect={handleBannerFileSelect}
          onClear={handleBannerClear}
          uploading={bannerUpload.loading}
          progress={bannerUpload.progress}
          aspectRatio="21/9"
          placeholder="Upload banner image"
          subtext="Wide image displayed at the top of the project page"
        />

        <ImageUpload
          label="Hero image (case study)"
          value={heroImageUrl}
          previewUrl={
            isEditing ? heroUpload.previewUrl || undefined : pendingHeroPreview || undefined
          }
          onFileSelect={handleHeroFileSelect}
          onClear={handleHeroClear}
          uploading={heroUpload.loading}
          progress={heroUpload.progress}
          aspectRatio="16/9"
          placeholder="Large image below title on case study layout"
          subtext="Used when case study mode is on; falls back to featured image if empty"
        />

        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
            Gallery images
          </label>
          <div className="flex flex-col gap-2">
            {galleryImages.map((imageUrl, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md">
                <span className="flex-1 truncate text-sm">{imageUrl}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeGalleryImage(index)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newGalleryImage}
                onChange={e => setNewGalleryImage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
                placeholder="Add gallery image URL..."
                className={cn(
                  'flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={addGalleryImage}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Images shown in the project gallery on the public detail page.
          </p>
        </div>

        {/* Technologies */}
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
            Technologies
          </label>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="hover:bg-primary/20 rounded-full p-0.5">
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTechnology}
                onChange={e => setNewTechnology(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                placeholder="Add a technology..."
                className={cn(
                  'flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={addTechnology}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
            Tags
          </label>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 bg-muted text-foreground px-3 py-1 rounded-full text-sm">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag..."
                className={cn(
                  'flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <ProjectCaseStudyFormSection
          enabled={caseStudyEnabled}
          onEnabledChange={v => {
            setCaseStudyEnabled(v);
            if (v && !project?.caseStudy) {
              setCaseStudy(emptyProjectCaseStudy());
            }
          }}
          caseStudy={caseStudy}
          onCaseStudyChange={setCaseStudy}
        />

        {/* Featured Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-foreground">Featured Project</label>
            <p className="text-xs text-muted-foreground">Highlight this project on the homepage</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={formValues.isFeatured}
            onClick={() => onChange('isFeatured', !formValues.isFeatured)}
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              formValues.isFeatured ? 'bg-primary' : 'bg-input'
            )}>
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
                formValues.isFeatured ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-foreground">Active</label>
            <p className="text-xs text-muted-foreground">
              Make this project visible on the website
            </p>
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

        {/* SEO Section */}
        <div className="grid gap-8 pt-4 border-t">
          <h3 className="text-sm font-semibold text-foreground">SEO Settings</h3>

          <RegularInput
            label="Meta Title"
            name="seoMetaTitle"
            placeholder="Custom page title for search engines"
            value={formValues.seoMetaTitle}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.seoMetaTitle : []}
            subtext="Leave empty to use project title"
          />

          <RegularTextarea
            label="Meta Description"
            name="seoMetaDescription"
            placeholder="Brief description for search engine results..."
            value={formValues.seoMetaDescription}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.seoMetaDescription : []}
            rows={2}
            subtext="Recommended: 150-160 characters"
          />

          <RegularInput
            label="Keywords"
            name="seoKeywords"
            placeholder="web development, react, typescript"
            value={formValues.seoKeywords}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.seoKeywords : []}
            subtext="Comma-separated list of keywords"
          />
        </div>
      </div>

      {/* Actions */}
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
          text={isEditing ? 'Update Project' : 'Create Project'}
          loading={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
};
