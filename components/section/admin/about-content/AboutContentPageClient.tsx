'use client';

import { useEffect, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { Button } from '@/components/ui/button';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import {
  ABOUT_VALUE_ICON_KEYS,
  DEFAULT_ABOUT_PAGE_CONTENT,
  type AboutPageContent,
  type AboutStatItem,
  type AboutValueIconKey,
} from '@/lib/types/about-page';

const iconOptions = ABOUT_VALUE_ICON_KEYS.map(key => ({
  value: key,
  text: key.charAt(0).toUpperCase() + key.slice(1),
}));

export const AboutContentPageClient = () => {
  const resource = useAdminResource({
    resourceKey: ['admin', 'site-settings', 'aboutPage'],
    endpoint: 'ADMIN_GET_SITE_SETTINGS',
    options: { query: '/aboutPage' },
    sectionLabel: 'Crelyst about page content',
  });

  const [content, setContent] = useState<AboutPageContent>(DEFAULT_ABOUT_PAGE_CONTENT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaults, setUsingDefaults] = useState(false);

  useEffect(() => {
    if (resource.data?.aboutPage) {
      setContent(resource.data.aboutPage as AboutPageContent);
      setUsingDefaults(false);
      return;
    }

    if (resource.isError) {
      setContent(DEFAULT_ABOUT_PAGE_CONTENT);
      setUsingDefaults(true);
    }
  }, [resource.data, resource.isError]);

  const heroUpload = useFileUpload({
    entityType: 'site-settings',
    entityId: 'settings',
    intent: 'banner-image',
    onUploadComplete: url => {
      setContent(current => ({
        ...current,
        hero: { ...current.hero, backgroundImage: url },
      }));
    },
  });

  const storyUpload = useFileUpload({
    entityType: 'site-settings',
    entityId: 'settings',
    intent: 'image',
    onUploadComplete: url => {
      setContent(current => ({
        ...current,
        story: { ...current.story, imageUrl: url },
      }));
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload: AboutPageContent = {
        ...content,
        story: {
          ...content.story,
          paragraphs: content.story.paragraphs.map(p => p.trim()).filter(Boolean),
        },
      };

      const data = await adminCallApiToast(
        'Saving about page…',
        () =>
          callApi('ADMIN_UPDATE_SITE_SETTINGS', {
            payload: {
              settingsPayload: [{ name: 'aboutPage', value: payload }],
            },
          }),
        'About page content saved'
      );

      if (!data) {
        setError('Failed to save about page content');
        return;
      }

      if (data.aboutPage) {
        setContent(data.aboutPage as AboutPageContent);
        setUsingDefaults(false);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (index: number, next: AboutStatItem) => {
    setContent(current => ({
      ...current,
      stats: current.stats.map((stat, i) => (i === index ? next : stat)),
    }));
  };

  const sectionStatus = usingDefaults ? 'success' : resource.status;

  return (
    <DashboardPageWrapper
      header={{
        title: 'About',
        description: 'Manage headings, copy, and images on the Crelyst about page',
      }}
      headerActions={
        <RegularBtn
          text="Save"
          LeftIcon={Save}
          leftIconProps={{ className: 'size-4' }}
          loading={saving}
          onClick={handleSave}
        />
      }>
      <AdminAsyncSection
        status={sectionStatus}
        errorMessage={usingDefaults ? null : resource.errorMessage}
        onRetry={resource.reload}
        loadingFallback={
          <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
            Loading about page content…
          </div>
        }>
        <div className="grid gap-6">
          {usingDefaults ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
              No saved about page content yet — showing current public defaults. Save to create the
              CMS slice.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <section className="grid gap-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Hero</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <RegularInput
                label="Badge"
                value={content.hero.badge}
                onChange={e =>
                  setContent(c => ({ ...c, hero: { ...c.hero, badge: e.target.value } }))
                }
              />
              <RegularInput
                label="Title line 1"
                value={content.hero.titleLine1}
                onChange={e =>
                  setContent(c => ({ ...c, hero: { ...c.hero, titleLine1: e.target.value } }))
                }
              />
              <RegularInput
                label="Title line 2"
                value={content.hero.titleLine2}
                onChange={e =>
                  setContent(c => ({ ...c, hero: { ...c.hero, titleLine2: e.target.value } }))
                }
              />
            </div>
            <RegularTextarea
              label="Description"
              value={content.hero.description}
              onChange={e =>
                setContent(c => ({ ...c, hero: { ...c.hero, description: e.target.value } }))
              }
              rows={3}
            />
            <ImageUpload
              label="Hero background"
              value={content.hero.backgroundImage}
              previewUrl={heroUpload.previewUrl || undefined}
              uploading={heroUpload.loading}
              progress={heroUpload.progress}
              aspectRatio="16/9"
              onFileSelect={file => {
                heroUpload.handleFileSelect(file);
                if (file) void heroUpload.uploadFile({ file });
              }}
              onClear={() => {
                heroUpload.handleFileSelect(null);
                setContent(c => ({ ...c, hero: { ...c.hero, backgroundImage: '' } }));
              }}
            />
            <RegularInput
              label="Background image URL"
              value={content.hero.backgroundImage}
              onChange={e =>
                setContent(c => ({
                  ...c,
                  hero: { ...c.hero, backgroundImage: e.target.value },
                }))
              }
            />
          </section>

          <section className="grid gap-4 rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Stats</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setContent(c => ({
                    ...c,
                    stats: [...c.stats, { kind: 'count', target: 0, label: '' }],
                  }))
                }>
                <Plus className="mr-1 size-4" />
                Add stat
              </Button>
            </div>
            {content.stats.map((stat, index) => (
              <div key={index} className="flex flex-wrap items-start gap-2">
                <RegularSelect
                  value={stat.kind}
                  onSelectChange={(value: string) => {
                    if (value === 'static') {
                      updateStat(index, { kind: 'static', value: '', label: stat.label });
                    } else {
                      updateStat(index, { kind: 'count', target: 0, label: stat.label });
                    }
                  }}
                  options={[
                    { value: 'count', text: 'Count' },
                    { value: 'static', text: 'Static' },
                  ]}
                  wrapClassName="w-32"
                />
                {stat.kind === 'count' ? (
                  <RegularInput
                    type="number"
                    placeholder="Target"
                    value={String(stat.target)}
                    onChange={e =>
                      updateStat(index, {
                        kind: 'count',
                        target: Number(e.target.value) || 0,
                        label: stat.label,
                      })
                    }
                    wrapClassName="w-28"
                  />
                ) : (
                  <RegularInput
                    placeholder="Value"
                    value={stat.value}
                    onChange={e =>
                      updateStat(index, {
                        kind: 'static',
                        value: e.target.value,
                        label: stat.label,
                      })
                    }
                    wrapClassName="w-28"
                  />
                )}
                <RegularInput
                  placeholder="Label"
                  value={stat.label}
                  onChange={e => updateStat(index, { ...stat, label: e.target.value })}
                  wrapClassName="min-w-[10rem] flex-1"
                />
                {content.stats.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setContent(c => ({
                        ...c,
                        stats: c.stats.filter((_, i) => i !== index),
                      }))
                    }>
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            ))}
          </section>

          <section className="grid gap-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Story</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <RegularInput
                label="Caption"
                value={content.story.caption}
                onChange={e =>
                  setContent(c => ({ ...c, story: { ...c.story, caption: e.target.value } }))
                }
              />
              <RegularInput
                label="Title"
                value={content.story.title}
                onChange={e =>
                  setContent(c => ({ ...c, story: { ...c.story, title: e.target.value } }))
                }
              />
              <RegularInput
                label="Subtitle"
                value={content.story.subtitle}
                onChange={e =>
                  setContent(c => ({ ...c, story: { ...c.story, subtitle: e.target.value } }))
                }
              />
              <RegularInput
                label="Image alt"
                value={content.story.imageAlt}
                onChange={e =>
                  setContent(c => ({ ...c, story: { ...c.story, imageAlt: e.target.value } }))
                }
              />
            </div>
            <ImageUpload
              label="Story image"
              value={content.story.imageUrl}
              previewUrl={storyUpload.previewUrl || undefined}
              uploading={storyUpload.loading}
              progress={storyUpload.progress}
              aspectRatio="4/3"
              onFileSelect={file => {
                storyUpload.handleFileSelect(file);
                if (file) void storyUpload.uploadFile({ file });
              }}
              onClear={() => {
                storyUpload.handleFileSelect(null);
                setContent(c => ({ ...c, story: { ...c.story, imageUrl: '' } }));
              }}
            />
            <RegularInput
              label="Image URL"
              value={content.story.imageUrl}
              onChange={e =>
                setContent(c => ({ ...c, story: { ...c.story, imageUrl: e.target.value } }))
              }
            />
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Paragraphs</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContent(c => ({
                      ...c,
                      story: { ...c.story, paragraphs: [...c.story.paragraphs, ''] },
                    }))
                  }>
                  <Plus className="mr-1 size-4" />
                  Add paragraph
                </Button>
              </div>
              {content.story.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <RegularTextarea
                    value={paragraph}
                    onChange={e =>
                      setContent(c => ({
                        ...c,
                        story: {
                          ...c.story,
                          paragraphs: c.story.paragraphs.map((p, i) =>
                            i === index ? e.target.value : p
                          ),
                        },
                      }))
                    }
                    rows={3}
                    wrapClassName="flex-1"
                  />
                  {content.story.paragraphs.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setContent(c => ({
                          ...c,
                          story: {
                            ...c.story,
                            paragraphs: c.story.paragraphs.filter((_, i) => i !== index),
                          },
                        }))
                      }>
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">Values</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <RegularInput
                label="Caption"
                value={content.values.caption}
                onChange={e =>
                  setContent(c => ({
                    ...c,
                    values: { ...c.values, caption: e.target.value },
                  }))
                }
              />
              <RegularInput
                label="Title"
                value={content.values.title}
                onChange={e =>
                  setContent(c => ({ ...c, values: { ...c.values, title: e.target.value } }))
                }
              />
              <RegularInput
                label="Supporting text"
                value={content.values.text}
                onChange={e =>
                  setContent(c => ({ ...c, values: { ...c.values, text: e.target.value } }))
                }
              />
            </div>
            {content.values.items.map((item, index) => (
              <div key={index} className="grid gap-2 rounded-lg border p-4">
                <div className="flex gap-2">
                  <RegularSelect
                    value={item.iconKey}
                    onSelectChange={(value: string) =>
                      setContent(c => ({
                        ...c,
                        values: {
                          ...c.values,
                          items: c.values.items.map((row, i) =>
                            i === index ? { ...row, iconKey: value as AboutValueIconKey } : row
                          ),
                        },
                      }))
                    }
                    options={iconOptions}
                    wrapClassName="w-40"
                  />
                  <RegularInput
                    value={item.title}
                    onChange={e =>
                      setContent(c => ({
                        ...c,
                        values: {
                          ...c.values,
                          items: c.values.items.map((row, i) =>
                            i === index ? { ...row, title: e.target.value } : row
                          ),
                        },
                      }))
                    }
                    wrapClassName="flex-1"
                  />
                </div>
                <RegularTextarea
                  value={item.description}
                  onChange={e =>
                    setContent(c => ({
                      ...c,
                      values: {
                        ...c.values,
                        items: c.values.items.map((row, i) =>
                          i === index ? { ...row, description: e.target.value } : row
                        ),
                      },
                    }))
                  }
                  rows={3}
                />
              </div>
            ))}
          </section>

          <section className="grid gap-4 rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold">CTA</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <RegularInput
                label="Caption"
                value={content.cta.caption}
                onChange={e =>
                  setContent(c => ({ ...c, cta: { ...c.cta, caption: e.target.value } }))
                }
              />
              <RegularInput
                label="Button label"
                value={content.cta.buttonLabel}
                onChange={e =>
                  setContent(c => ({ ...c, cta: { ...c.cta, buttonLabel: e.target.value } }))
                }
              />
            </div>
            <RegularInput
              label="Title"
              value={content.cta.title}
              onChange={e => setContent(c => ({ ...c, cta: { ...c.cta, title: e.target.value } }))}
            />
            <RegularTextarea
              label="Description"
              value={content.cta.description}
              onChange={e =>
                setContent(c => ({ ...c, cta: { ...c.cta, description: e.target.value } }))
              }
              rows={3}
            />
          </section>
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
};
