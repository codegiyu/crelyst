'use client';

import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { z } from 'zod';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientTeamMember } from '@/lib/constants/endpoints';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/lib/hooks/use-file-upload';

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  bio: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  isActive: z.boolean().optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  member?: ClientTeamMember | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TeamMemberForm = ({ member, onSuccess, onCancel }: TeamMemberFormProps) => {
  const isEditing = !!member;

  // Pending uploads for creation flow
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);

  // Image URL (from server or after upload)
  const [imageUrl, setImageUrl] = useState<string>(member?.image || '');

  // Upload hook for editing mode (immediate upload)
  const imageUpload = useFileUpload({
    entityType: 'team-member',
    entityId: member?._id || '',
    intent: 'image',
    onUploadComplete: url => {
      setImageUrl(url);
    },
  });

  // Handle image file selection
  const handleImageFileSelect = useCallback(
    (file: File | null) => {
      if (isEditing && file) {
        // Immediate upload for editing
        imageUpload.handleFileSelect(file);
        imageUpload.uploadFile({ file });
      } else {
        // Store for later upload on creation
        if (pendingImagePreview) {
          URL.revokeObjectURL(pendingImagePreview);
        }
        setPendingImageFile(file);
        setPendingImagePreview(file ? URL.createObjectURL(file) : null);
      }
    },
    [isEditing, imageUpload, pendingImagePreview]
  );

  // Clear image
  const handleImageClear = useCallback(() => {
    if (isEditing) {
      imageUpload.clearFile();
    } else if (pendingImagePreview) {
      URL.revokeObjectURL(pendingImagePreview);
    }
    setPendingImageFile(null);
    setPendingImagePreview(null);
    setImageUrl('');
  }, [isEditing, imageUpload, pendingImagePreview]);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    onChange,
  } = useForm<typeof teamMemberSchema>({
    formSchema: teamMemberSchema,
    defaultFormValues: {
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      email: member?.email || '',
      phone: member?.phone || '',
      linkedinUrl: member?.socials?.linkedin || '',
      twitterUrl: member?.socials?.twitter || '',
      githubUrl: member?.socials?.github || '',
      websiteUrl: member?.socials?.website || '',
      isActive: member?.isActive ?? true,
    },
    onSubmit: async (values: TeamMemberFormValues) => {
      try {
        // Build socials object
        const socials = {
          linkedin: values.linkedinUrl || undefined,
          twitter: values.twitterUrl || undefined,
          github: values.githubUrl || undefined,
          website: values.websiteUrl || undefined,
        };

        if (isEditing) {
          // Update existing team member - image already uploaded immediately
          const payload = {
            name: values.name,
            role: values.role,
            bio: values.bio,
            email: values.email,
            phone: values.phone,
            image: imageUrl || undefined,
            socials,
            isActive: values.isActive,
          };

          const { data, error } = await callApi('ADMIN_UPDATE_TEAM_MEMBER', {
            query: `/${member._id}`,
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to update team member'] });
            return false;
          }

          toast.success('Team member updated successfully');
        } else {
          // Create new team member first (without image)
          const payload = {
            name: values.name,
            role: values.role,
            bio: values.bio,
            email: values.email,
            phone: values.phone,
            socials,
            isActive: values.isActive,
          };

          const { data, error } = await callApi('ADMIN_CREATE_TEAM_MEMBER', {
            payload,
          });

          if (error || !data) {
            setFormErrors({ root: [error?.message || 'Failed to create team member'] });
            return false;
          }

          const createdMember = data.teamMember;
          let finalImageUrl = '';

          // Now upload pending image with the real member ID
          if (pendingImageFile) {
            toast.info('Uploading profile image...');
            const result = await imageUpload.uploadFile({
              file: pendingImageFile,
              entityId: createdMember._id,
              intent: 'image',
            });
            if (result?.url) {
              finalImageUrl = result.url;
            }
          }

          // Update team member with image URL if we uploaded one
          if (finalImageUrl) {
            await callApi('ADMIN_UPDATE_TEAM_MEMBER', {
              query: `/${createdMember._id}`,
              payload: { image: finalImageUrl },
            });
          }

          toast.success('Team member created successfully');
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
        {/* Profile Image */}
        <ImageUpload
          label="Profile Image"
          value={imageUrl}
          previewUrl={
            isEditing ? imageUpload.previewUrl || undefined : pendingImagePreview || undefined
          }
          onFileSelect={handleImageFileSelect}
          onClear={handleImageClear}
          uploading={imageUpload.loading}
          progress={imageUpload.progress}
          aspectRatio="3/4"
          placeholder="Upload profile photo"
          subtext="Recommended: Portrait orientation (3:4 aspect ratio)"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <RegularInput
            label="Name"
            name="name"
            required
            placeholder="e.g., John Doe"
            value={formValues.name}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.name : []}
          />

          <RegularInput
            label="Role"
            name="role"
            required
            placeholder="e.g., Software Engineer"
            value={formValues.role}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.role : []}
          />
        </div>

        <RegularTextarea
          label="Bio"
          name="bio"
          placeholder="A brief description about this team member..."
          value={formValues.bio}
          onChange={handleInputChange}
          errors={errorsVisible ? formErrors.bio : []}
          rows={3}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <RegularInput
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formValues.email}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.email : []}
          />

          <RegularInput
            label="Phone"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={formValues.phone}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.phone : []}
          />
        </div>

        {/* Social Links */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-foreground">Social Links</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <RegularInput
              label="LinkedIn"
              name="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              value={formValues.linkedinUrl}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.linkedinUrl : []}
            />

            <RegularInput
              label="Twitter/X"
              name="twitterUrl"
              placeholder="https://twitter.com/username"
              value={formValues.twitterUrl}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.twitterUrl : []}
            />

            <RegularInput
              label="GitHub"
              name="githubUrl"
              placeholder="https://github.com/username"
              value={formValues.githubUrl}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.githubUrl : []}
            />

            <RegularInput
              label="Website"
              name="websiteUrl"
              placeholder="https://example.com"
              value={formValues.websiteUrl}
              onChange={handleInputChange}
              errors={errorsVisible ? formErrors.websiteUrl : []}
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-foreground">Active</label>
            <p className="text-xs text-muted-foreground">Show this team member on the website</p>
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
          text={isEditing ? 'Update Member' : 'Add Member'}
          loading={loading}
          className="flex-1"
        />
      </div>
    </form>
  );
};
