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

const legalSchema = z.object({
  termsOfServiceUrl: z.string().url('Invalid URL').or(z.literal('')),
  privacyPolicyUrl: z.string().url('Invalid URL').or(z.literal('')),
  cookiePolicyUrl: z.string().url('Invalid URL').or(z.literal('')),
  disclaimerText: z.string(),
});

type LegalFormValues = z.infer<typeof legalSchema>;

interface LegalTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const LegalTab = ({ settings }: LegalTabProps) => {
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
  } = useForm<typeof legalSchema>({
    formSchema: legalSchema,
    defaultFormValues: {
      termsOfServiceUrl: settings.legal?.termsOfServiceUrl || '',
      privacyPolicyUrl: settings.legal?.privacyPolicyUrl || '',
      cookiePolicyUrl: settings.legal?.cookiePolicyUrl || '',
      disclaimerText: settings.legal?.disclaimerText || '',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: LegalFormValues) => {
      try {
        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'legal', value: values }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update legal settings'] });
          return false;
        }

        updateSettings({ legal: values });
        toast.success('Legal settings updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.legal) {
      setFormValues({
        termsOfServiceUrl: settings.legal.termsOfServiceUrl || '',
        privacyPolicyUrl: settings.legal.privacyPolicyUrl || '',
        cookiePolicyUrl: settings.legal.cookiePolicyUrl || '',
        disclaimerText: settings.legal.disclaimerText || '',
      });
    }
  }, [
    settings.legal?.termsOfServiceUrl,
    settings.legal?.privacyPolicyUrl,
    settings.legal?.cookiePolicyUrl,
    settings.legal?.disclaimerText,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Legal & Compliance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage legal documents and compliance settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <RegularInput
          label="Terms of Service URL"
          name="termsOfServiceUrl"
          value={formValues.termsOfServiceUrl}
          onChange={handleInputChange}
          placeholder="https://yoursite.com/terms"
          errors={errorsVisible ? formErrors.termsOfServiceUrl : []}
        />

        <RegularInput
          label="Privacy Policy URL"
          name="privacyPolicyUrl"
          value={formValues.privacyPolicyUrl}
          onChange={handleInputChange}
          placeholder="https://yoursite.com/privacy"
          errors={errorsVisible ? formErrors.privacyPolicyUrl : []}
        />

        <RegularInput
          label="Cookie Policy URL"
          name="cookiePolicyUrl"
          value={formValues.cookiePolicyUrl}
          onChange={handleInputChange}
          placeholder="https://yoursite.com/cookies"
          errors={errorsVisible ? formErrors.cookiePolicyUrl : []}
        />

        <RegularTextarea
          label="Disclaimer Text"
          name="disclaimerText"
          value={formValues.disclaimerText}
          onChange={handleInputChange}
          placeholder="Enter any disclaimer text..."
          rows={4}
          errors={errorsVisible ? formErrors.disclaimerText : []}
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
