'use client';

import { useState, useEffect } from 'react';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SOCIAL_PLATFORMS, type SocialPlatform, type Social } from '@/lib/types/site-settings';

interface SocialsTabProps {
  settings: Partial<ClientSiteSettings>;
}

const platformOptions = SOCIAL_PLATFORMS.map(platform => ({
  value: platform,
  text: platform.charAt(0).toUpperCase() + platform.slice(1),
}));

export const SocialsTab = ({ settings }: SocialsTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

  const [socials, setSocials] = useState<Social[]>(settings.socials || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update socials when settings change
  useEffect(() => {
    if (settings.socials) {
      setSocials(settings.socials);
    }
  }, [settings.socials]);

  const handleAdd = () => {
    setSocials(prev => [...prev, { platform: 'facebook', href: '' }]);
  };

  const handleRemove = (index: number) => {
    setSocials(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Social, value: string) => {
    setSocials(prev =>
      prev.map((social, i) => (i === index ? { ...social, [field]: value } : social))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const validSocials = socials.filter(s => s.href.trim());

      const { data, error: apiError } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
        payload: {
          settingsPayload: [{ name: 'socials', value: validSocials }],
        },
      });

      if (apiError || !data) {
        setError(apiError?.message || 'Failed to update social links');
        return;
      }

      updateSettings({ socials: validSocials });
      toast.success('Social links updated successfully');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
        <p className="text-sm text-muted-foreground mt-1">Connect your social media profiles</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Social Profiles</label>
            <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
              <Plus className="size-4 mr-1" />
              Add Profile
            </Button>
          </div>

          {socials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <p className="text-sm">No social profiles added yet</p>
              <Button type="button" variant="link" size="sm" onClick={handleAdd} className="mt-2">
                Add your first profile
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {socials.map((social, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <RegularSelect
                    value={social.platform}
                    onSelectChange={(value: string) =>
                      handleChange(index, 'platform', value as SocialPlatform)
                    }
                    options={platformOptions}
                    wrapClassName="w-40"
                  />
                  <RegularInput
                    value={social.href}
                    onChange={e => handleChange(index, 'href', e.target.value)}
                    placeholder="https://..."
                    wrapClassName="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="shrink-0 text-destructive hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <RegularBtn
            type="submit"
            text="Save Changes"
            LeftIcon={Save}
            leftIconProps={{ className: 'size-4' }}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
