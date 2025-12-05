'use client';

import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { IconSelect } from '@/components/atoms/IconSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientService } from '@/lib/constants/endpoints';
import { useState, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  // SEO fields
  seoMetaTitle: z.string().max(100, 'Meta title is too long').optional(),
  seoMetaDescription: z.string().max(300, 'Meta description is too long').optional(),
  seoKeywords: z.string().optional(), // Will be split into array on submit
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: ClientService | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ServiceForm = ({ service, onSuccess, onCancel }: ServiceFormProps) => {
  const isEditing = !!service;
  const [features, setFeatures] = useState<string[]>(service?.features || []);
  const [newFeature, setNewFeature] = useState('');
  // For new services: toggle to use banner image as card image
  const [useBannerAsCard, setUseBannerAsCard] = useState(!isEditing);

  // Pending uploads for creation flow (files stored locally until service is created)
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [pendingBannerPreview, setPendingBannerPreview] = useState<string | null>(null);
  const [pendingCardFile, setPendingCardFile] = useState<File | null>(null);
  const [pendingCardPreview, setPendingCardPreview] = useState<string | null>(null);

  // Image URLs (from server or after upload)
  const [bannerImageUrl, setBannerImageUrl] = useState<string>(service?.bannerImage || '');
  const [cardImageUrl, setCardImageUrl] = useState<string>(service?.cardImage || '');

  // Upload hooks for editing mode (immediate upload)
  const bannerUpload = useFileUpload({
    entityType: 'service',
    entityId: service?._id || '',
    intent: 'banner-image',
    onUploadComplete: url => {
      setBannerImageUrl(url);
    },
  });

  const cardUpload = useFileUpload({
    entityType: 'service',
    entityId: service?._id || '',
    intent: 'card-image',
    onUploadComplete: url => {
      setCardImageUrl(url);
    },
  });

  // Handle banner file selection
  const handleBannerFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        // Immediate upload for editing
        bannerUpload.handleFileSelect(file);
        bannerUpload.uploadFile({ file });
      } else {
        // Store for later upload on creation
        if (pendingBannerPreview) {
          URL.revokeObjectURL(pendingBannerPreview);
        }
        setPendingBannerFile(file);
        setPendingBannerPreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, bannerUpload, pendingBannerPreview]
  );

  // Handle card file selection
  const handleCardFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        // Immediate upload for editing
        cardUpload.handleFileSelect(file);
        cardUpload.uploadFile({ file });
      } else {
        // Store for later upload on creation
        if (pendingCardPreview) {
          URL.revokeObjectURL(pendingCardPreview);
        }
        setPendingCardFile(file);
        setPendingCardPreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, cardUpload, pendingCardPreview]
  );

  // Clear banner image
  const handleBannerClear = useCallback(() => {
    if (isEditing) {
      bannerUpload.clearFile();
    } else if (pendingBannerPreview) {
      URL.revokeObjectURL(pendingBannerPreview);
    }
    setPendingBannerFile(null);
    setPendingBannerPreview(null);
    setBannerImageUrl('');
  }, [isEditing, bannerUpload, pendingBannerPreview]);

  // Clear card image
  const handleCardClear = useCallback(() => {
    if (isEditing) {
      cardUpload.clearFile();
    } else if (pendingCardPreview) {
      URL.revokeObjectURL(pendingCardPreview);
    }
    setPendingCardFile(null);
    setPendingCardPreview(null);
    setCardImageUrl('');
  }, [isEditing, cardUpload, pendingCardPreview]);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    onChange,
  } = useForm<typeof serviceSchema>({
    formSchema: serviceSchema,
    defaultFormValues: {
      title: service?.title || '',
      description: service?.description || '',
      shortDescription: service?.shortDescription || '',
      icon: service?.icon || '',
      isActive: service?.isActive ?? true,
      seoMetaTitle: service?.seo?.metaTitle || '',
      seoMetaDescription: service?.seo?.metaDescription || '',
      seoKeywords: service?.seo?.keywords?.join(', ') || '',
    },
    onSubmit: async (values: ServiceFormValues) => {
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
          // Update existing service - images already uploaded immediately
          const payload = {
            title: values.title,
            description: values.description,
            shortDescription: values.shortDescription,
            icon: values.icon,
            bannerImage: bannerImageUrl || undefined,
            cardImage: cardImageUrl || undefined,
            isActive: values.isActive,
            features,
            seo,
          };

          const { data, error } = await callApi('ADMIN_UPDATE_SERVICE', {
            query: `/${service.slug}`,
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to update service'] });
            return false;
          }

          toast.success('Service updated successfully');
        } else {
          // Create new service first (without images)
          const payload = {
            title: values.title,
            description: values.description,
            shortDescription: values.shortDescription,
            icon: values.icon,
            isActive: values.isActive,
            features,
            seo,
          };

          const { data, error } = await callApi('ADMIN_CREATE_SERVICE', {
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to create service'] });
            return false;
          }

          const createdService = data.service;
          let finalBannerUrl = '';
          let finalCardUrl = '';

          // Now upload pending images with the real service ID
          if (pendingBannerFile) {
            toast.info('Uploading banner image...');
            const result = await bannerUpload.uploadFile({
              file: pendingBannerFile,
              entityId: createdService._id,
              intent: 'banner-image',
            });
            if (result?.url) {
              finalBannerUrl = result.url;
            }
          }

          if (!useBannerAsCard && pendingCardFile) {
            toast.info('Uploading card image...');
            const result = await cardUpload.uploadFile({
              file: pendingCardFile,
              entityId: createdService._id,
              intent: 'card-image',
            });
            if (result?.url) {
              finalCardUrl = result.url;
            }
          } else if (useBannerAsCard && finalBannerUrl) {
            // Use banner as card image
            finalCardUrl = finalBannerUrl;
          }

          // Update service with image URLs if we uploaded any
          if (finalBannerUrl || finalCardUrl) {
            const updatePayload: Record<string, string> = {};
            if (finalBannerUrl) updatePayload.bannerImage = finalBannerUrl;
            if (finalCardUrl) updatePayload.cardImage = finalCardUrl;

            await callApi('ADMIN_UPDATE_SERVICE', {
              query: `/${createdService.slug}`,
              payload: updatePayload,
            });
          }

          toast.success('Service created successfully');
        }

        onSuccess();
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <div className="space-y-4">
        <RegularInput
          label="Title"
          name="title"
          required
          placeholder="e.g., Web Development"
          value={formValues.title}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.title : []}
        />

        <RegularTextarea
          label="Description"
          name="description"
          required
          placeholder="Describe this service in detail..."
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

        <IconSelect
          label="Icon"
          name="icon"
          placeholder="Select an icon for this service..."
          value={formValues.icon}
          onChange={value => onChange('icon', value)}
          errors={errorsVisible ? formErrors.icon : []}
          subtext="(Icon displayed on service cards)"
        />

        {/* Banner Image */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
              Banner Image
            </span>
            {!isEditing && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBannerAsCard}
                  onChange={e => setUseBannerAsCard(e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                Also use as card image
              </label>
            )}
          </div>
          <ImageUpload
            value={bannerImageUrl}
            previewUrl={
              isEditing ? bannerUpload.previewUrl || undefined : pendingBannerPreview || undefined
            }
            onFileSelect={handleBannerFileSelect}
            onClear={handleBannerClear}
            uploading={bannerUpload.loading}
            progress={bannerUpload.progress}
            aspectRatio="16/9"
            placeholder="Upload banner image"
            subtext="Large image displayed on the service detail page header"
          />
        </div>

        {/* Card Image - Show if editing OR if not using banner as card */}
        {(isEditing || !useBannerAsCard) && (
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
            subtext="Smaller image displayed on service cards and previews"
          />
        )}

        {/* Features */}
        <div className="space-y-2">
          <label className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
            Features
          </label>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md">
                <span className="flex-1 text-sm">{feature}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => removeFeature(index)}>
                  <X className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Add a feature..."
                className={cn(
                  'flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              />
              <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-foreground">Active</label>
            <p className="text-xs text-muted-foreground">
              Make this service visible on the website
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
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-foreground">SEO Settings</h3>

          <RegularInput
            label="Meta Title"
            name="seoMetaTitle"
            placeholder="Custom page title for search engines"
            value={formValues.seoMetaTitle}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.seoMetaTitle : []}
            subtext="Leave empty to use service title"
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
            placeholder="web development, design, coding"
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
          text={isEditing ? 'Update Service' : 'Create Service'}
          loading={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
};
