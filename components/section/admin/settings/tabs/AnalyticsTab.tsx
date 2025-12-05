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

const analyticsSchema = z.object({
  googleAnalyticsId: z.string(),
  facebookPixelId: z.string(),
  otherTrackingIds: z.string(), // Will be split into array on submit
});

type AnalyticsFormValues = z.infer<typeof analyticsSchema>;

interface AnalyticsTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const AnalyticsTab = ({ settings }: AnalyticsTabProps) => {
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
  } = useForm<typeof analyticsSchema>({
    formSchema: analyticsSchema,
    defaultFormValues: {
      googleAnalyticsId: settings.analytics?.googleAnalyticsId || '',
      facebookPixelId: settings.analytics?.facebookPixelId || '',
      otherTrackingIds: settings.analytics?.otherTrackingIds?.join('\n') || '',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: AnalyticsFormValues) => {
      try {
        const analyticsValue = {
          googleAnalyticsId: values.googleAnalyticsId,
          facebookPixelId: values.facebookPixelId,
          otherTrackingIds: values.otherTrackingIds
            .split('\n')
            .map(id => id.trim())
            .filter(Boolean),
        };

        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'analytics', value: analyticsValue }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update analytics settings'] });
          return false;
        }

        updateSettings({ analytics: analyticsValue });
        toast.success('Analytics settings updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.analytics) {
      setFormValues({
        googleAnalyticsId: settings.analytics.googleAnalyticsId || '',
        facebookPixelId: settings.analytics.facebookPixelId || '',
        otherTrackingIds: settings.analytics.otherTrackingIds?.join('\n') || '',
      });
    }
  }, [
    settings.analytics?.googleAnalyticsId,
    settings.analytics?.facebookPixelId,
    settings.analytics?.otherTrackingIds,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Analytics & Tracking</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure analytics and tracking integrations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <RegularInput
          label="Google Analytics ID"
          name="googleAnalyticsId"
          value={formValues.googleAnalyticsId}
          onChange={handleInputChange}
          placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
          errors={errorsVisible ? formErrors.googleAnalyticsId : []}
        />

        <RegularInput
          label="Facebook Pixel ID"
          name="facebookPixelId"
          value={formValues.facebookPixelId}
          onChange={handleInputChange}
          placeholder="XXXXXXXXXXXXXXXX"
          errors={errorsVisible ? formErrors.facebookPixelId : []}
        />

        <RegularTextarea
          label="Other Tracking IDs"
          name="otherTrackingIds"
          value={formValues.otherTrackingIds}
          onChange={handleInputChange}
          placeholder="Enter additional tracking IDs (one per line)"
          subtext="Enter each tracking ID on a new line"
          rows={4}
          errors={errorsVisible ? formErrors.otherTrackingIds : []}
        />

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
