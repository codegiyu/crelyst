'use client';

import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { Save } from 'lucide-react';

const emailSchema = z.object({
  fromEmail: z.string().email('Invalid email address').or(z.literal('')),
  fromName: z.string(),
  replyToEmail: z.string().email('Invalid email address').or(z.literal('')),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const EmailTab = ({ settings }: EmailTabProps) => {
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
  } = useForm<typeof emailSchema>({
    formSchema: emailSchema,
    defaultFormValues: {
      fromEmail: settings.email?.fromEmail || '',
      fromName: settings.email?.fromName || '',
      replyToEmail: settings.email?.replyToEmail || '',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: EmailFormValues) => {
      const data = await adminCallApiToast(
        'Saving email settings…',
        () =>
          callApi('ADMIN_UPDATE_SITE_SETTINGS', {
            payload: {
              settingsPayload: [{ name: 'email', value: values }],
            },
          }),
        'Email settings updated successfully'
      );

      if (!data) {
        setFormErrors({ root: ['Failed to update email settings'] });
        return false;
      }

      updateSettings({ email: values });
      return true;
    },
  });

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Email Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">Configure outgoing email settings</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <RegularInput
          label="From Email"
          name="fromEmail"
          type="email"
          value={formValues.fromEmail}
          onChange={handleInputChange}
          placeholder="noreply@yoursite.com"
          errors={errorsVisible ? formErrors.fromEmail : []}
        />

        <RegularInput
          label="From Name"
          name="fromName"
          value={formValues.fromName}
          onChange={handleInputChange}
          placeholder="Your Company Name"
          errors={errorsVisible ? formErrors.fromName : []}
        />

        <RegularInput
          label="Reply-To Email"
          name="replyToEmail"
          type="email"
          value={formValues.replyToEmail}
          onChange={handleInputChange}
          placeholder="support@yoursite.com"
          errors={errorsVisible ? formErrors.replyToEmail : []}
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
