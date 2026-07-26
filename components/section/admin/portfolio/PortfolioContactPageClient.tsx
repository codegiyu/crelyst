'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { Button } from '@/components/ui/button';
import { PublishBbsButton } from './PublishBbsButton';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import type { ClientBbsSiteContent } from '@/lib/constants/endpoints';
import type { BbsSocialPlatform } from '@/lib/types/bbs-site-content';

const PLATFORM_OPTIONS: { value: BbsSocialPlatform; text: string }[] = [
  { value: 'instagram', text: 'Instagram' },
  { value: 'x', text: 'X' },
  { value: 'twitter', text: 'Twitter' },
  { value: 'whatsapp', text: 'WhatsApp' },
  { value: 'linkedin', text: 'LinkedIn' },
  { value: 'facebook', text: 'Facebook' },
  { value: 'tiktok', text: 'TikTok' },
  { value: 'youtube', text: 'YouTube' },
];

const emptyContact = (): ClientBbsSiteContent['contact'] => ({
  eyebrow: '',
  headingPrefix: '',
  headingHighlight: '',
  description: '',
  email: '',
  socials: [],
});

export const PortfolioContactPageClient = () => {
  const resource = useAdminResource({
    resourceKey: ['admin', 'bbs-site-content'],
    endpoint: 'ADMIN_GET_BBS_SITE_CONTENT',
    sectionLabel: 'Bold Brand Studio contact content',
  });

  const [contact, setContact] = useState<ClientBbsSiteContent['contact']>(emptyContact);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resource.data?.content.contact) {
      setContact(resource.data.content.contact);
    }
  }, [resource.data]);

  const updateField = <K extends keyof ClientBbsSiteContent['contact']>(
    key: K,
    value: ClientBbsSiteContent['contact'][K]
  ) => {
    setContact(current => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payloadContact = {
        ...contact,
        email: contact.email.trim(),
        socials: contact.socials.filter(social => social.href.trim()),
      };

      const data = await adminCallApiToast(
        'Saving contact content…',
        () =>
          callApi('ADMIN_UPDATE_BBS_SITE_CONTENT', {
            payload: { contact: payloadContact },
          }),
        'Contact content saved'
      );

      if (!data) {
        setError('Failed to save contact content');
        return;
      }

      setContact(data.content.contact);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Contact',
        description: 'Edit Bold Brand Studio contact copy, email, and social links',
      }}
      headerActions={
        <div className="flex flex-wrap items-center gap-2">
          <PublishBbsButton disabled={resource.isError || resource.isLoading} />
          <RegularBtn
            text="Save"
            LeftIcon={Save}
            leftIconProps={{ className: 'size-4' }}
            loading={saving}
            disabled={resource.isError || resource.isLoading}
            onClick={handleSave}
          />
        </div>
      }>
      <AdminAsyncSection
        status={resource.status}
        errorMessage={resource.errorMessage}
        onRetry={resource.reload}
        loadingFallback={
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            Loading contact content…
          </div>
        }>
        <div className="rounded-xl border bg-card shadow-sm">
          <form
            className="grid gap-6 p-6"
            onSubmit={e => {
              e.preventDefault();
              void handleSave();
            }}>
            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <RegularInput
                label="Eyebrow"
                value={contact.eyebrow}
                onChange={e => updateField('eyebrow', e.target.value)}
              />
              <RegularInput
                label="Email"
                type="email"
                value={contact.email}
                onChange={e => updateField('email', e.target.value)}
              />
              <RegularInput
                label="Heading prefix"
                value={contact.headingPrefix}
                onChange={e => updateField('headingPrefix', e.target.value)}
              />
              <RegularInput
                label="Heading highlight"
                value={contact.headingHighlight}
                onChange={e => updateField('headingHighlight', e.target.value)}
              />
            </div>

            <RegularTextarea
              label="Description"
              value={contact.description}
              onChange={e => updateField('description', e.target.value)}
              rows={4}
            />

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Social links</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContact(current => ({
                      ...current,
                      socials: [...current.socials, { platform: 'instagram', href: '' }],
                    }))
                  }>
                  <Plus className="mr-1 size-4" />
                  Add profile
                </Button>
              </div>

              {contact.socials.length === 0 ? (
                <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                  No social profiles yet
                </div>
              ) : (
                contact.socials.map((social, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <RegularSelect
                      value={social.platform}
                      onSelectChange={(value: string) =>
                        setContact(current => ({
                          ...current,
                          socials: current.socials.map((item, i) =>
                            i === index ? { ...item, platform: value as BbsSocialPlatform } : item
                          ),
                        }))
                      }
                      options={PLATFORM_OPTIONS}
                      wrapClassName="w-40"
                    />
                    <RegularInput
                      placeholder="https://"
                      value={social.href}
                      onChange={e =>
                        setContact(current => ({
                          ...current,
                          socials: current.socials.map((item, i) =>
                            i === index ? { ...item, href: e.target.value } : item
                          ),
                        }))
                      }
                      wrapClassName="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContact(current => ({
                          ...current,
                          socials: current.socials.filter((_, i) => i !== index),
                        }))
                      }>
                      <X className="size-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </form>
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
};
