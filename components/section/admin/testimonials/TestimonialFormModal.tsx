/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTestimonial } from '@/lib/constants/endpoints';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { Star } from 'lucide-react';

const testimonialSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientRole: z.string().optional(),
  companyName: z.string().optional(),
  testimonial: z.string().min(1, 'Testimonial content is required'),
  rating: z.number().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: ClientTestimonial | null;
  onSuccess: () => void;
}

export const TestimonialFormModal = ({
  open,
  onOpenChange,
  testimonial,
  onSuccess,
}: TestimonialFormModalProps) => {
  const isEditing = !!testimonial;
  const [rating, setRating] = useState<number>(testimonial?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Pending uploads for creation flow
  const [pendingClientImageFile, setPendingClientImageFile] = useState<File | null>(null);
  const [pendingClientImagePreview, setPendingClientImagePreview] = useState<string | null>(null);
  const [pendingCompanyLogoFile, setPendingCompanyLogoFile] = useState<File | null>(null);
  const [pendingCompanyLogoPreview, setPendingCompanyLogoPreview] = useState<string | null>(null);

  // Image URLs
  const [clientImageUrl, setClientImageUrl] = useState<string>(testimonial?.clientImage || '');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>(testimonial?.companyLogo || '');

  // Upload hooks for editing mode
  const clientImageUpload = useFileUpload({
    entityType: 'testimonial',
    entityId: testimonial?._id || '',
    intent: 'avatar',
    onUploadComplete: url => {
      setClientImageUrl(url);
    },
  });

  const companyLogoUpload = useFileUpload({
    entityType: 'testimonial',
    entityId: testimonial?._id || '',
    intent: 'logo',
    onUploadComplete: url => {
      setCompanyLogoUrl(url);
    },
  });

  // Handle client image file selection
  const handleClientImageFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        clientImageUpload.handleFileSelect(file);
        clientImageUpload.uploadFile({ file });
      } else {
        if (pendingClientImagePreview) {
          URL.revokeObjectURL(pendingClientImagePreview);
        }
        setPendingClientImageFile(file);
        setPendingClientImagePreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, clientImageUpload, pendingClientImagePreview]
  );

  // Handle company logo file selection
  const handleCompanyLogoFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        companyLogoUpload.handleFileSelect(file);
        companyLogoUpload.uploadFile({ file });
      } else {
        if (pendingCompanyLogoPreview) {
          URL.revokeObjectURL(pendingCompanyLogoPreview);
        }
        setPendingCompanyLogoFile(file);
        setPendingCompanyLogoPreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, companyLogoUpload, pendingCompanyLogoPreview]
  );

  // Clear client image
  const handleClientImageClear = useCallback(() => {
    if (isEditing) {
      clientImageUpload.clearFile();
    } else if (pendingClientImagePreview) {
      URL.revokeObjectURL(pendingClientImagePreview);
    }
    setPendingClientImageFile(null);
    setPendingClientImagePreview(null);
    setClientImageUrl('');
  }, [isEditing, clientImageUpload, pendingClientImagePreview]);

  // Clear company logo
  const handleCompanyLogoClear = useCallback(() => {
    if (isEditing) {
      companyLogoUpload.clearFile();
    } else if (pendingCompanyLogoPreview) {
      URL.revokeObjectURL(pendingCompanyLogoPreview);
    }
    setPendingCompanyLogoFile(null);
    setPendingCompanyLogoPreview(null);
    setCompanyLogoUrl('');
  }, [isEditing, companyLogoUpload, pendingCompanyLogoPreview]);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    setFormValues,
    onChange,
    resetForm,
  } = useForm<typeof testimonialSchema>({
    formSchema: testimonialSchema,
    defaultFormValues: {
      clientName: testimonial?.clientName || '',
      clientRole: testimonial?.clientRole || '',
      companyName: testimonial?.companyName || '',
      testimonial: testimonial?.testimonial || '',
      rating: testimonial?.rating ?? 5,
      isFeatured: testimonial?.isFeatured ?? false,
      isActive: testimonial?.isActive ?? false,
      displayOrder: testimonial?.displayOrder ?? 0,
    },
    onSubmit,
  });

  const handleReset = () => {
    // Reset form values and errors
    resetForm();
    setFormErrors({});

    // Reset rating
    setRating(5);
    setHoverRating(0);

    // Clear pending image uploads
    if (pendingClientImagePreview) {
      URL.revokeObjectURL(pendingClientImagePreview);
    }
    setPendingClientImageFile(null);
    setPendingClientImagePreview(null);

    if (pendingCompanyLogoPreview) {
      URL.revokeObjectURL(pendingCompanyLogoPreview);
    }
    setPendingCompanyLogoFile(null);
    setPendingCompanyLogoPreview(null);

    // Clear image URLs
    setClientImageUrl('');
    setCompanyLogoUrl('');

    // Clear upload state
    if (isEditing) {
      clientImageUpload.clearFile();
      companyLogoUpload.clearFile();
    }
  };

  async function onSubmit(values: TestimonialFormValues) {
    try {
      if (isEditing) {
        // Update existing testimonial - images already uploaded immediately
        const payload = {
          clientName: values.clientName,
          clientRole: values.clientRole,
          companyName: values.companyName,
          testimonial: values.testimonial,
          rating,
          isFeatured: values.isFeatured,
          isActive: values.isActive ?? false,
          displayOrder: values.displayOrder,
          clientImage: clientImageUrl || '',
          companyLogo: companyLogoUrl || '',
        };

        const { data, error } = await callApi('ADMIN_UPDATE_TESTIMONIAL', {
          query: `/${testimonial._id}`,
          payload,
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update testimonial'] });
          return false;
        }

        toast.success('Testimonial updated successfully');
      } else {
        // Create new testimonial first (without images)
        const payload = {
          clientName: values.clientName,
          clientRole: values.clientRole,
          companyName: values.companyName,
          testimonial: values.testimonial,
          rating,
          isFeatured: values.isFeatured,
          isActive: values.isActive ?? false,
          displayOrder: values.displayOrder,
        };

        const { data, error } = await callApi('ADMIN_CREATE_TESTIMONIAL', {
          payload,
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to create testimonial'] });
          return false;
        }

        const createdTestimonial = data.testimonial;
        let finalClientImageUrl = '';
        let finalCompanyLogoUrl = '';

        // Upload pending images with the real testimonial ID
        if (pendingClientImageFile) {
          toast.info('Uploading client image...');
          const result = await clientImageUpload.uploadFile({
            file: pendingClientImageFile,
            entityId: createdTestimonial._id,
            intent: 'avatar',
          });
          if (result?.url) {
            finalClientImageUrl = result.url;
          }
        }

        if (pendingCompanyLogoFile) {
          toast.info('Uploading company logo...');
          const result = await companyLogoUpload.uploadFile({
            file: pendingCompanyLogoFile,
            entityId: createdTestimonial._id,
            intent: 'logo',
          });
          if (result?.url) {
            finalCompanyLogoUrl = result.url;
          }
        }

        // Update testimonial with image URLs if we uploaded any
        if (finalClientImageUrl || finalCompanyLogoUrl) {
          const updatePayload: Record<string, string> = {};
          if (finalClientImageUrl) updatePayload.clientImage = finalClientImageUrl;
          if (finalCompanyLogoUrl) updatePayload.companyLogo = finalCompanyLogoUrl;

          await callApi('ADMIN_UPDATE_TESTIMONIAL', {
            query: `/${createdTestimonial._id}`,
            payload: updatePayload,
          });
        }

        toast.success('Testimonial created successfully');
      }

      onSuccess();
      onOpenChange(false);
      handleReset();
      return true;
    } catch {
      setFormErrors({ root: ['An unexpected error occurred'] });
      return false;
    }
  }

  // Clear all data when modal closes
  useEffect(() => {
    if (open) return;

    handleReset();
  }, [open, isEditing]);

  // Update form values and image URLs when testimonial changes or modal opens
  useEffect(() => {
    if (!open) return;

    const newFormValues = testimonial
      ? {
          clientName: testimonial.clientName || '',
          clientRole: testimonial.clientRole || '',
          companyName: testimonial.companyName || '',
          testimonial: testimonial.testimonial || '',
          rating: testimonial.rating ?? 5,
          isFeatured: testimonial.isFeatured ?? false,
          isActive: testimonial.isActive ?? false,
          displayOrder: testimonial.displayOrder ?? 0,
        }
      : {
          clientName: '',
          clientRole: '',
          companyName: '',
          testimonial: '',
          rating: 5,
          isFeatured: false,
          isActive: false,
          displayOrder: 0,
        };

    setFormValues(newFormValues);
    setRating(testimonial?.rating ?? 5);
    setClientImageUrl(testimonial?.clientImage || '');
    setCompanyLogoUrl(testimonial?.companyLogo || '');

    // Clear pending uploads when modal opens
    if (pendingClientImagePreview) {
      URL.revokeObjectURL(pendingClientImagePreview);
      setPendingClientImagePreview(null);
    }
    setPendingClientImageFile(null);

    if (pendingCompanyLogoPreview) {
      URL.revokeObjectURL(pendingCompanyLogoPreview);
      setPendingCompanyLogoPreview(null);
    }
    setPendingCompanyLogoFile(null);
  }, [
    open,
    testimonial?._id,
    testimonial?.clientName,
    testimonial?.clientRole,
    testimonial?.companyName,
    testimonial?.testimonial,
    testimonial?.rating,
    testimonial?.isFeatured,
    testimonial?.isActive,
    testimonial?.displayOrder,
    testimonial?.clientImage,
    testimonial?.companyLogo,
  ]);

  const handleModalCancel = () => {
    onOpenChange(false);
    handleReset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="xl"
      header={{
        title: isEditing ? 'Edit Testimonial' : 'Add Testimonial',
        description: isEditing
          ? 'Update the testimonial details below'
          : 'Fill in the details to add a new testimonial',
      }}
      cancelButton={{
        text: 'Cancel',
        onClick: handleModalCancel,
        disabled: loading,
      }}
      submitButton={{
        text: isEditing ? 'Update Testimonial' : 'Add Testimonial',
        onClick: handleSubmit,
        loading,
      }}>
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <div className="grid gap-4">
          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RegularInput
              label="Client Name"
              name="clientName"
              required
              placeholder="e.g., John Smith"
              value={formValues.clientName}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.clientName : []}
            />

            <RegularInput
              label="Client Role"
              name="clientRole"
              placeholder="e.g., CEO, CTO, Manager"
              value={formValues.clientRole}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.clientRole : []}
            />
          </div>

          <RegularInput
            label="Company Name"
            name="companyName"
            placeholder="e.g., Acme Corporation"
            value={formValues.companyName}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.companyName : []}
          />

          <RegularTextarea
            label="Testimonial"
            name="testimonial"
            required
            placeholder="What did the client say about your work?"
            value={formValues.testimonial}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.testimonial : []}
            rows={4}
          />

          {/* Rating */}
          <div className="grid gap-2">
            <label className="text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform">
                  <Star
                    className={`size-6 ${
                      value <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{rating} out of 5</span>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUpload
              label="Client Photo"
              value={clientImageUrl}
              previewUrl={
                isEditing
                  ? clientImageUpload.previewUrl || undefined
                  : pendingClientImagePreview || undefined
              }
              onFileSelect={handleClientImageFileSelect}
              onClear={handleClientImageClear}
              uploading={clientImageUpload.loading}
              progress={clientImageUpload.progress}
              aspectRatio="1/1"
              placeholder="Upload client photo"
              subtext="Profile photo of the client"
            />

            <ImageUpload
              label="Company Logo"
              value={companyLogoUrl}
              previewUrl={
                isEditing
                  ? companyLogoUpload.previewUrl || undefined
                  : pendingCompanyLogoPreview || undefined
              }
              onFileSelect={handleCompanyLogoFileSelect}
              onClear={handleCompanyLogoClear}
              uploading={companyLogoUpload.loading}
              progress={companyLogoUpload.progress}
              aspectRatio="1/1"
              placeholder="Upload company logo"
              subtext="Client's company logo"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-sm font-medium text-foreground">Featured</label>
              <p className="text-xs text-muted-foreground">
                Show this testimonial prominently on the website
              </p>
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
                Make this testimonial visible on the website
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
        </div>
      </form>
    </Modal>
  );
};
