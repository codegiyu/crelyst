/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Label } from '@/components/ui/label';

const brandingSchema = z.object({
  faviconUrl: z.string().url('Invalid URL').or(z.literal('')),
  primaryBrandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .or(z.literal('')),
  secondaryBrandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .or(z.literal('')),
});

type BrandingFormValues = z.infer<typeof brandingSchema>;

interface BrandingTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const BrandingTab = ({ settings }: BrandingTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

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
  } = useForm<typeof brandingSchema>({
    formSchema: brandingSchema,
    defaultFormValues: {
      faviconUrl: settings.branding?.faviconUrl || '',
      primaryBrandColor: settings.branding?.primaryBrandColor || '#000000',
      secondaryBrandColor: settings.branding?.secondaryBrandColor || '#ffffff',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: BrandingFormValues) => {
      try {
        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'branding', value: values }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update branding'] });
          return false;
        }

        updateSettings({ branding: values });
        toast.success('Branding updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.branding) {
      setFormValues({
        faviconUrl: settings.branding.faviconUrl || '',
        primaryBrandColor: settings.branding.primaryBrandColor || '#000000',
        secondaryBrandColor: settings.branding.secondaryBrandColor || '#ffffff',
      });
    }
  }, [
    settings.branding?.faviconUrl,
    settings.branding?.primaryBrandColor,
    settings.branding?.secondaryBrandColor,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Branding</h2>
        <p className="text-sm text-muted-foreground mt-1">Customize your brand colors and assets</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <RegularInput
          label="Favicon URL"
          name="faviconUrl"
          value={formValues.faviconUrl}
          onChange={handleInputChange}
          placeholder="https://..."
          errors={errorsVisible ? formErrors.faviconUrl : []}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Primary Brand Color</Label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={formValues.primaryBrandColor || '#000000'}
                onChange={e => onChange('primaryBrandColor', e.target.value)}
                className="w-12 h-10 rounded border border-input cursor-pointer"
              />
              <RegularInput
                name="primaryBrandColor"
                value={formValues.primaryBrandColor}
                onChange={handleInputChange}
                placeholder="#000000"
                wrapClassName="flex-1"
                errors={errorsVisible ? formErrors.primaryBrandColor : []}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Secondary Brand Color</Label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={formValues.secondaryBrandColor || '#ffffff'}
                onChange={e => onChange('secondaryBrandColor', e.target.value)}
                className="w-12 h-10 rounded border border-input cursor-pointer"
              />
              <RegularInput
                name="secondaryBrandColor"
                value={formValues.secondaryBrandColor}
                onChange={handleInputChange}
                placeholder="#ffffff"
                wrapClassName="flex-1"
                errors={errorsVisible ? formErrors.secondaryBrandColor : []}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preview</Label>
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex gap-4 items-center">
              <div
                className="w-16 h-16 rounded-lg shadow-sm"
                style={{ backgroundColor: formValues.primaryBrandColor || '#000000' }}
              />
              <div
                className="w-16 h-16 rounded-lg shadow-sm border"
                style={{ backgroundColor: formValues.secondaryBrandColor || '#ffffff' }}
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Primary: <code className="text-xs">{formValues.primaryBrandColor}</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  Secondary: <code className="text-xs">{formValues.secondaryBrandColor}</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <RegularBtn
            type="submit"
            text="Save Changes"
            LeftIcon={Save}
            leftIconProps={{ className: 'size-4' }}
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};
