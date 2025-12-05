/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const featuresSchema = z.object({
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
  loginEnabled: z.boolean(),
});

type FeaturesFormValues = z.infer<typeof featuresSchema>;

interface FeaturesTabProps {
  settings: Partial<ClientSiteSettings>;
}

interface FeatureToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  warning?: boolean;
}

const FeatureToggle = ({ label, description, checked, onChange, warning }: FeatureToggleProps) => (
  <div
    className={cn(
      'flex items-start justify-between gap-4 p-4 rounded-lg border transition-colors',
      checked ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-transparent'
    )}>
    <div className="grid gap-1">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {warning && checked && <AlertTriangle className="size-4 text-amber-500" />}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        checked ? 'bg-primary' : 'bg-input'
      )}>
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  </div>
);

export const FeaturesTab = ({ settings }: FeaturesTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleSubmit,
    setFormErrors,
    setFormValues,
    onChange,
  } = useForm<typeof featuresSchema>({
    formSchema: featuresSchema,
    defaultFormValues: {
      maintenanceMode: settings.features?.maintenanceMode ?? false,
      registrationEnabled: settings.features?.registrationEnabled ?? true,
      loginEnabled: settings.features?.loginEnabled ?? true,
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: FeaturesFormValues) => {
      try {
        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'features', value: values }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update feature flags'] });
          return false;
        }

        updateSettings({ features: values });
        toast.success('Feature flags updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  useEffect(() => {
    if (settings.features) {
      setFormValues({
        maintenanceMode: settings.features.maintenanceMode ?? false,
        registrationEnabled: settings.features.registrationEnabled ?? true,
        loginEnabled: settings.features.loginEnabled ?? true,
      });
    }
  }, [
    settings.features?.maintenanceMode,
    settings.features?.registrationEnabled,
    settings.features?.loginEnabled,
  ]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Feature Flags</h2>
        <p className="text-sm text-muted-foreground mt-1">Enable or disable site features</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-4">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <FeatureToggle
          label="Maintenance Mode"
          description="When enabled, the site will display a maintenance page to visitors"
          checked={formValues.maintenanceMode}
          onChange={checked => onChange('maintenanceMode', checked)}
          warning
        />

        <FeatureToggle
          label="User Registration"
          description="Allow new users to create accounts"
          checked={formValues.registrationEnabled}
          onChange={checked => onChange('registrationEnabled', checked)}
        />

        <FeatureToggle
          label="User Login"
          description="Allow users to log in to their accounts"
          checked={formValues.loginEnabled}
          onChange={checked => onChange('loginEnabled', checked)}
        />

        <div className="flex justify-end pt-4 border-t mt-6">
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
