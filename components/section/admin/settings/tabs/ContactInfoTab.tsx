/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const contactInfoSchema = z.object({
  whatsapp: z.string(),
  locationUrl: z.string().url('Invalid URL').or(z.literal('')),
});

type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const ContactInfoTab = ({ settings }: ContactInfoTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

  // Manage arrays separately as they need dynamic handling
  const [addresses, setAddresses] = useState<string[]>(settings.contactInfo?.address || ['']);
  const [phones, setPhones] = useState<string[]>(settings.contactInfo?.tel || ['']);
  const [emails, setEmails] = useState<string[]>(settings.contactInfo?.email || ['']);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    setFormValues,
  } = useForm<typeof contactInfoSchema>({
    formSchema: contactInfoSchema,
    defaultFormValues: {
      whatsapp: settings.contactInfo?.whatsapp || '',
      locationUrl: settings.contactInfo?.locationUrl || '',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: ContactInfoFormValues) => {
      try {
        const contactInfoValue = {
          address: addresses.filter(a => a.trim()),
          tel: phones.filter(t => t.trim()),
          email: emails.filter(e => e.trim()),
          whatsapp: values.whatsapp,
          locationUrl: values.locationUrl,
          officeHours: settings.contactInfo?.officeHours || {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
          },
        };

        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'contactInfo', value: contactInfoValue }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update contact info'] });
          return false;
        }

        updateSettings({ contactInfo: contactInfoValue });
        toast.success('Contact info updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  // Update form and arrays when settings change
  useEffect(() => {
    if (settings.contactInfo) {
      setFormValues({
        whatsapp: settings.contactInfo.whatsapp || '',
        locationUrl: settings.contactInfo.locationUrl || '',
      });
      setAddresses(settings.contactInfo.address?.length ? settings.contactInfo.address : ['']);
      setPhones(settings.contactInfo.tel?.length ? settings.contactInfo.tel : ['']);
      setEmails(settings.contactInfo.email?.length ? settings.contactInfo.email : ['']);
    }
  }, [
    settings.contactInfo?.whatsapp,
    settings.contactInfo?.locationUrl,
    settings.contactInfo?.address,
    settings.contactInfo?.tel,
    settings.contactInfo?.email,
  ]);

  // Array helpers
  const handleArrayAdd = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, '']);
  };

  const handleArrayRemove = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleArrayChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your business contact details</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        {/* Addresses */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Addresses</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(setAddresses)}>
              <Plus className="size-4 mr-1" />
              Add
            </Button>
          </div>
          {addresses.map((addr, index) => (
            <div key={index} className="flex gap-2">
              <RegularInput
                value={addr}
                onChange={e => handleArrayChange(setAddresses, index, e.target.value)}
                placeholder="Enter address"
                wrapClassName="flex-1"
              />
              {addresses.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArrayRemove(setAddresses, index)}
                  className="shrink-0 text-destructive hover:text-destructive">
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Phone Numbers */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Phone Numbers</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(setPhones)}>
              <Plus className="size-4 mr-1" />
              Add
            </Button>
          </div>
          {phones.map((phone, index) => (
            <div key={index} className="flex gap-2">
              <RegularInput
                value={phone}
                onChange={e => handleArrayChange(setPhones, index, e.target.value)}
                placeholder="Enter phone number"
                wrapClassName="flex-1"
              />
              {phones.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArrayRemove(setPhones, index)}
                  className="shrink-0 text-destructive hover:text-destructive">
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Emails */}
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Email Addresses</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleArrayAdd(setEmails)}>
              <Plus className="size-4 mr-1" />
              Add
            </Button>
          </div>
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <RegularInput
                type="email"
                value={email}
                onChange={e => handleArrayChange(setEmails, index, e.target.value)}
                placeholder="Enter email address"
                wrapClassName="flex-1"
              />
              {emails.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArrayRemove(setEmails, index)}
                  className="shrink-0 text-destructive hover:text-destructive">
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <RegularInput
          label="WhatsApp Number"
          name="whatsapp"
          value={formValues.whatsapp}
          onChange={handleInputChange}
          placeholder="Enter WhatsApp number"
          errors={errorsVisible ? formErrors.whatsapp : []}
        />

        <RegularInput
          label="Location URL (Google Maps)"
          name="locationUrl"
          value={formValues.locationUrl}
          onChange={handleInputChange}
          placeholder="https://maps.google.com/..."
          errors={errorsVisible ? formErrors.locationUrl : []}
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
