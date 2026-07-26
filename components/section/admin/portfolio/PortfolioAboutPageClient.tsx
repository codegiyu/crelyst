'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Button } from '@/components/ui/button';
import { PublishBbsButton } from './PublishBbsButton';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import type { ClientBbsSiteContent } from '@/lib/constants/endpoints';
import type { BbsAboutStat } from '@/lib/types/bbs-site-content';

const emptyAbout = (): ClientBbsSiteContent['about'] => ({
  eyebrow: '',
  headingLine1: '',
  headingHighlight: '',
  paragraphs: [''],
  imageUrl: '',
  imageAlt: '',
  stats: [{ value: '', label: '' }],
});

export const PortfolioAboutPageClient = () => {
  const resource = useAdminResource({
    resourceKey: ['admin', 'bbs-site-content'],
    endpoint: 'ADMIN_GET_BBS_SITE_CONTENT',
    sectionLabel: 'Bold Brand Studio about content',
  });

  const [about, setAbout] = useState<ClientBbsSiteContent['about']>(emptyAbout);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resource.data?.content.about) {
      setAbout(resource.data.content.about);
    }
  }, [resource.data]);

  const imageUpload = useFileUpload({
    entityType: 'bbs-site-content',
    entityId: 'content',
    intent: 'image',
    onUploadComplete: url => {
      setAbout(current => ({ ...current, imageUrl: url }));
    },
  });

  const updateField = <K extends keyof ClientBbsSiteContent['about']>(
    key: K,
    value: ClientBbsSiteContent['about'][K]
  ) => {
    setAbout(current => ({ ...current, [key]: value }));
  };

  const updateParagraph = (index: number, value: string) => {
    setAbout(current => ({
      ...current,
      paragraphs: current.paragraphs.map((paragraph, i) => (i === index ? value : paragraph)),
    }));
  };

  const updateStat = (index: number, field: keyof BbsAboutStat, value: string) => {
    setAbout(current => ({
      ...current,
      stats: current.stats.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payloadAbout = {
        ...about,
        paragraphs: about.paragraphs.map(p => p.trim()).filter(Boolean),
        stats: about.stats.filter(stat => stat.value.trim() && stat.label.trim()),
      };

      const data = await adminCallApiToast(
        'Saving about content…',
        () =>
          callApi('ADMIN_UPDATE_BBS_SITE_CONTENT', {
            payload: { about: payloadAbout },
          }),
        'About content saved'
      );

      if (!data) {
        setError('Failed to save about content');
        return;
      }

      setAbout(data.content.about);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'About',
        description: 'Edit the Bold Brand Studio home about section writeup and portrait',
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
            Loading about content…
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
                value={about.eyebrow}
                onChange={e => updateField('eyebrow', e.target.value)}
              />
              <RegularInput
                label="Image alt text"
                value={about.imageAlt}
                onChange={e => updateField('imageAlt', e.target.value)}
              />
              <RegularInput
                label="Heading line"
                value={about.headingLine1}
                onChange={e => updateField('headingLine1', e.target.value)}
              />
              <RegularInput
                label="Heading highlight"
                value={about.headingHighlight}
                onChange={e => updateField('headingHighlight', e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Paragraphs</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAbout(current => ({
                      ...current,
                      paragraphs: [...current.paragraphs, ''],
                    }))
                  }>
                  <Plus className="mr-1 size-4" />
                  Add paragraph
                </Button>
              </div>
              {about.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <RegularTextarea
                    value={paragraph}
                    onChange={e => updateParagraph(index, e.target.value)}
                    rows={3}
                    wrapClassName="flex-1"
                  />
                  {about.paragraphs.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setAbout(current => ({
                          ...current,
                          paragraphs: current.paragraphs.filter((_, i) => i !== index),
                        }))
                      }>
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Stats</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAbout(current => ({
                      ...current,
                      stats: [...current.stats, { value: '', label: '' }],
                    }))
                  }>
                  <Plus className="mr-1 size-4" />
                  Add stat
                </Button>
              </div>
              {about.stats.map((stat, index) => (
                <div key={index} className="flex gap-2">
                  <RegularInput
                    placeholder="Value"
                    value={stat.value}
                    onChange={e => updateStat(index, 'value', e.target.value)}
                    wrapClassName="w-32"
                  />
                  <RegularInput
                    placeholder="Label"
                    value={stat.label}
                    onChange={e => updateStat(index, 'label', e.target.value)}
                    wrapClassName="flex-1"
                  />
                  {about.stats.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setAbout(current => ({
                          ...current,
                          stats: current.stats.filter((_, i) => i !== index),
                        }))
                      }>
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ImageUpload
                label="Portrait image"
                value={about.imageUrl || undefined}
                previewUrl={imageUpload.previewUrl || undefined}
                uploading={imageUpload.loading}
                progress={imageUpload.progress}
                aspectRatio="4/5"
                placeholder="Upload portrait"
                onFileSelect={file => {
                  imageUpload.handleFileSelect(file);
                  if (file) void imageUpload.uploadFile({ file });
                }}
                onClear={() => {
                  imageUpload.handleFileSelect(null);
                  setAbout(current => ({ ...current, imageUrl: '' }));
                }}
              />
            </div>
          </form>
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
};
