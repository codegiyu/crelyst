'use client';

import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientBrand } from '@/lib/constants/endpoints';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  websiteUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  brand?: ClientBrand | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BrandForm = ({ brand, onSuccess, onCancel }: BrandFormProps) => {
  const isEditing = !!brand;

  // Pending uploads for creation flow (files stored locally until brand is created)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [pendingLogoPreview, setPendingLogoPreview] = useState<string | null>(null);

  // Image URL (from server or after upload)
  const [logoUrl, setLogoUrl] = useState<string>(brand?.logo || '');

  // Upload hook for editing mode (immediate upload)
  const logoUpload = useFileUpload({
    entityType: 'brand',
    entityId: brand?._id || '',
    intent: 'logo',
    onUploadComplete: url => {
      setLogoUrl(url);
    },
  });

  // Handle logo file selection
  const handleLogoFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        // Immediate upload for editing
        logoUpload.handleFileSelect(file);
        logoUpload.uploadFile({ file });
      } else {
        // Store for later upload on creation
        if (pendingLogoPreview) {
          URL.revokeObjectURL(pendingLogoPreview);
        }
        setPendingLogoFile(file);
        setPendingLogoPreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, logoUpload, pendingLogoPreview]
  );

  // Clear logo
  const handleLogoClear = useCallback(() => {
    if (isEditing) {
      logoUpload.clearFile();
    } else if (pendingLogoPreview) {
      URL.revokeObjectURL(pendingLogoPreview);
    }
    setPendingLogoFile(null);
    setPendingLogoPreview(null);
    setLogoUrl('');
  }, [isEditing, logoUpload, pendingLogoPreview]);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    onChange,
  } = useForm<typeof brandSchema>({
    formSchema: brandSchema,
    defaultFormValues: {
      name: brand?.name || '',
      websiteUrl: brand?.websiteUrl || '',
      isActive: brand?.isActive ?? true,
    },
    onSubmit: async (values: BrandFormValues) => {
      try {
        if (isEditing) {
          // Update existing brand - images already uploaded immediately
          const payload = {
            name: values.name,
            websiteUrl: values.websiteUrl || undefined,
            logo: logoUrl || undefined,
            isActive: values.isActive,
          };

          const { data, error } = await callApi('ADMIN_UPDATE_BRAND', {
            query: `/${brand._id}`,
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to update brand'] });
            return false;
          }

          toast.success('Brand updated successfully');
        } else {
          // Create new brand first (without logo)
          const payload = {
            name: values.name,
            websiteUrl: values.websiteUrl || undefined,
            logo: '', // Will be updated after upload
            isActive: values.isActive,
          };

          const { data, error } = await callApi('ADMIN_CREATE_BRAND', {
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to create brand'] });
            return false;
          }

          const createdBrand = data.brand;
          let finalLogoUrl = '';

          // Now upload pending logo with the real brand ID
          if (pendingLogoFile) {
            toast.info('Uploading logo...');
            const result = await logoUpload.uploadFile({
              file: pendingLogoFile,
              entityId: createdBrand._id,
              intent: 'logo',
            });
            if (result?.url) {
              finalLogoUrl = result.url;
            }
          }

          // Update brand with logo URL if we uploaded one
          if (finalLogoUrl) {
            await callApi('ADMIN_UPDATE_BRAND', {
              query: `/${createdBrand._id}`,
              payload: { logo: finalLogoUrl },
            });
          }

          toast.success('Brand created successfully');
        }

        onSuccess();
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {formErrors.root[0]}
        </div>
      )}

      <div className="space-y-4">
        <RegularInput
          label="Brand Name"
          name="name"
          required
          placeholder="e.g., Acme Corporation"
          value={formValues.name}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.name : []}
        />

        <RegularInput
          label="Website URL"
          name="websiteUrl"
          placeholder="https://example.com"
          value={formValues.websiteUrl}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.websiteUrl : []}
          subtext="Optional - link to the brand's website"
        />

        {/* Logo */}
        <ImageUpload
          label="Brand Logo"
          value={logoUrl}
          previewUrl={
            isEditing ? logoUpload.previewUrl || undefined : pendingLogoPreview || undefined
          }
          onFileSelect={handleLogoFileSelect}
          onClear={handleLogoClear}
          uploading={logoUpload.loading}
          progress={logoUpload.progress}
          aspectRatio="1/1"
          placeholder="Upload brand logo"
          subtext="Recommended: Square image with transparent background (PNG)"
        />

        {/* Active Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-foreground">Active</label>
            <p className="text-xs text-muted-foreground">Make this brand visible on the website</p>
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
          text={isEditing ? 'Update Brand' : 'Add Brand'}
          loading={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
};
