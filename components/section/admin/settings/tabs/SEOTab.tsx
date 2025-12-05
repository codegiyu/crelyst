/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const seoSchema = z.object({
  metaTitleTemplate: z.string(),
  metaDescription: z.string().max(300, 'Description too long'),
  keywords: z.string(), // Will be split into array on submit
  ogImageUrl: z.string().url('Invalid URL').or(z.literal('')),
  faviconUrl: z.string().url('Invalid URL').or(z.literal('')),
  canonicalUrlBase: z.string().url('Invalid URL').or(z.literal('')),
  robotsIndex: z.boolean(),
  robotsFollow: z.boolean(),
});

type SEOFormValues = z.infer<typeof seoSchema>;

interface SEOTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const SEOTab = ({ settings }: SEOTabProps) => {
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
  } = useForm<typeof seoSchema>({
    formSchema: seoSchema,
    defaultFormValues: {
      metaTitleTemplate: settings.seo?.metaTitleTemplate || '',
      metaDescription: settings.seo?.metaDescription || '',
      keywords: settings.seo?.keywords?.join(', ') || '',
      ogImageUrl: settings.seo?.ogImageUrl || '',
      faviconUrl: settings.seo?.faviconUrl || '',
      canonicalUrlBase: settings.seo?.canonicalUrlBase || '',
      robotsIndex: settings.seo?.robotsIndex ?? true,
      robotsFollow: settings.seo?.robotsFollow ?? true,
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: SEOFormValues) => {
      try {
        const seoValue = {
          ...values,
          keywords: values.keywords
            .split(',')
            .map(k => k.trim())
            .filter(Boolean),
        };

        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'seo', value: seoValue }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update SEO settings'] });
          return false;
        }

        updateSettings({ seo: seoValue });
        toast.success('SEO settings updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.seo) {
      setFormValues({
        metaTitleTemplate: settings.seo.metaTitleTemplate || '',
        metaDescription: settings.seo.metaDescription || '',
        keywords: settings.seo.keywords?.join(', ') || '',
        ogImageUrl: settings.seo.ogImageUrl || '',
        faviconUrl: settings.seo.faviconUrl || '',
        canonicalUrlBase: settings.seo.canonicalUrlBase || '',
        robotsIndex: settings.seo.robotsIndex ?? true,
        robotsFollow: settings.seo.robotsFollow ?? true,
      });
    }
  }, [
    settings.seo?.metaTitleTemplate,
    settings.seo?.metaDescription,
    settings.seo?.keywords,
    settings.seo?.ogImageUrl,
    settings.seo?.faviconUrl,
    settings.seo?.canonicalUrlBase,
    settings.seo?.robotsIndex,
    settings.seo?.robotsFollow,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">SEO Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Optimize your site for search engines</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <RegularInput
          label="Meta Title Template"
          name="metaTitleTemplate"
          value={formValues.metaTitleTemplate}
          onChange={handleInputChange}
          placeholder="%s | Your Site Name"
          subtext="Use %s as a placeholder for page titles"
          errors={errorsVisible ? formErrors.metaTitleTemplate : []}
        />

        <RegularTextarea
          label="Meta Description"
          name="metaDescription"
          value={formValues.metaDescription}
          onChange={handleInputChange}
          placeholder="Default meta description for your site"
          rows={3}
          errors={errorsVisible ? formErrors.metaDescription : []}
        />

        <RegularTextarea
          label="Keywords"
          name="keywords"
          value={formValues.keywords}
          onChange={handleInputChange}
          placeholder="keyword1, keyword2, keyword3"
          subtext="Separate keywords with commas"
          rows={2}
          errors={errorsVisible ? formErrors.keywords : []}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <RegularInput
            label="OG Image URL"
            name="ogImageUrl"
            value={formValues.ogImageUrl}
            onChange={handleInputChange}
            placeholder="https://..."
            errors={errorsVisible ? formErrors.ogImageUrl : []}
          />

          <RegularInput
            label="Favicon URL"
            name="faviconUrl"
            value={formValues.faviconUrl}
            onChange={handleInputChange}
            placeholder="https://..."
            errors={errorsVisible ? formErrors.faviconUrl : []}
          />
        </div>

        <RegularInput
          label="Canonical URL Base"
          name="canonicalUrlBase"
          value={formValues.canonicalUrlBase}
          onChange={handleInputChange}
          placeholder="https://yoursite.com"
          errors={errorsVisible ? formErrors.canonicalUrlBase : []}
        />

        <div className="grid gap-4">
          <Label className="text-sm font-medium">Robots Settings</Label>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={formValues.robotsIndex}
                onClick={() => onChange('robotsIndex', !formValues.robotsIndex)}
                className={cn(
                  'size-5 rounded border flex items-center justify-center transition-colors',
                  formValues.robotsIndex
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input bg-background'
                )}>
                {formValues.robotsIndex && (
                  <svg
                    className="size-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-foreground">Allow indexing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={formValues.robotsFollow}
                onClick={() => onChange('robotsFollow', !formValues.robotsFollow)}
                className={cn(
                  'size-5 rounded border flex items-center justify-center transition-colors',
                  formValues.robotsFollow
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input bg-background'
                )}>
                {formValues.robotsFollow && (
                  <svg
                    className="size-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-foreground">Allow following links</span>
            </label>
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
