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

const localizationSchema = z.object({
  defaultLanguage: z.string().min(2, 'Language code required'),
  supportedLanguages: z.string(), // Will be split into array on submit
  defaultTimezone: z.string().min(1, 'Timezone required'),
  defaultCurrency: z
    .string()
    .min(3, 'Currency code required')
    .max(3, 'Currency code must be 3 characters'),
});

type LocalizationFormValues = z.infer<typeof localizationSchema>;

interface LocalizationTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const LocalizationTab = ({ settings }: LocalizationTabProps) => {
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
  } = useForm<typeof localizationSchema>({
    formSchema: localizationSchema,
    defaultFormValues: {
      defaultLanguage: settings.localization?.defaultLanguage || 'en',
      supportedLanguages: settings.localization?.supportedLanguages?.join(', ') || 'en',
      defaultTimezone: settings.localization?.defaultTimezone || 'UTC',
      defaultCurrency: settings.localization?.defaultCurrency || 'USD',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: LocalizationFormValues) => {
      try {
        const localizationValue = {
          ...values,
          supportedLanguages: values.supportedLanguages
            .split(',')
            .map(l => l.trim())
            .filter(Boolean),
        };

        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'localization', value: localizationValue }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update localization settings'] });
          return false;
        }

        updateSettings({ localization: localizationValue });
        toast.success('Localization settings updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.localization) {
      setFormValues({
        defaultLanguage: settings.localization.defaultLanguage || 'en',
        supportedLanguages: settings.localization.supportedLanguages?.join(', ') || 'en',
        defaultTimezone: settings.localization.defaultTimezone || 'UTC',
        defaultCurrency: settings.localization.defaultCurrency || 'USD',
      });
    }
  }, [
    settings.localization?.defaultLanguage,
    settings.localization?.supportedLanguages,
    settings.localization?.defaultTimezone,
    settings.localization?.defaultCurrency,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Localization</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure language and regional settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <RegularInput
            label="Default Language"
            name="defaultLanguage"
            value={formValues.defaultLanguage}
            onChange={handleInputChange}
            placeholder="en"
            subtext="ISO 639-1 language code"
            errors={errorsVisible ? formErrors.defaultLanguage : []}
          />

          <RegularInput
            label="Supported Languages"
            name="supportedLanguages"
            value={formValues.supportedLanguages}
            onChange={handleInputChange}
            placeholder="en, es, fr"
            subtext="Comma-separated language codes"
            errors={errorsVisible ? formErrors.supportedLanguages : []}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <RegularInput
            label="Default Timezone"
            name="defaultTimezone"
            value={formValues.defaultTimezone}
            onChange={handleInputChange}
            placeholder="UTC"
            subtext="IANA timezone identifier"
            errors={errorsVisible ? formErrors.defaultTimezone : []}
          />

          <RegularInput
            label="Default Currency"
            name="defaultCurrency"
            value={formValues.defaultCurrency}
            onChange={handleInputChange}
            placeholder="USD"
            subtext="ISO 4217 currency code"
            errors={errorsVisible ? formErrors.defaultCurrency : []}
          />
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
