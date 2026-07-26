'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { DashboardPageWrapper } from '@/components/general/DashboardPageWrapper';
import { AdminAsyncSection } from '@/components/general/admin/AdminAsyncSection';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { ImageUpload } from '@/components/atoms/ImageUpload';
import { PublishBbsButton } from './PublishBbsButton';
import { callApi } from '@/lib/services/callApi';
import { adminCallApiToast } from '@/lib/utils/adminMutationToast';
import { useAdminResource } from '@/lib/hooks/use-admin-resource';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import type { ClientBbsSiteContent } from '@/lib/constants/endpoints';

const emptyListingSeo = (): ClientBbsSiteContent['projectsListingSeo'] => ({
  metaTitle: '',
  metaDescription: '',
  ogImageUrl: '',
  keywords: [],
});

export const PortfolioProjectsSeoPageClient = () => {
  const resource = useAdminResource({
    resourceKey: ['admin', 'bbs-site-content'],
    endpoint: 'ADMIN_GET_BBS_SITE_CONTENT',
    sectionLabel: 'Bold Brand Studio projects listing SEO',
  });

  const [listingSeo, setListingSeo] =
    useState<ClientBbsSiteContent['projectsListingSeo']>(emptyListingSeo);
  const [keywordsText, setKeywordsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resource.data?.content.projectsListingSeo) {
      const next = resource.data.content.projectsListingSeo;
      setListingSeo(next);
      setKeywordsText(next.keywords.join(', '));
    }
  }, [resource.data]);

  const ogUpload = useFileUpload({
    entityType: 'bbs-site-content',
    entityId: 'content',
    intent: 'banner-image',
    onUploadComplete: url => {
      setListingSeo(current => ({ ...current, ogImageUrl: url }));
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...listingSeo,
        metaTitle: listingSeo.metaTitle.trim(),
        metaDescription: listingSeo.metaDescription.trim(),
        ogImageUrl: listingSeo.ogImageUrl.trim(),
        keywords: keywordsText
          .split(',')
          .map(k => k.trim())
          .filter(Boolean),
      };

      const data = await adminCallApiToast(
        'Saving projects listing SEO…',
        () =>
          callApi('ADMIN_UPDATE_BBS_SITE_CONTENT', {
            payload: { projectsListingSeo: payload },
          }),
        'Projects listing SEO saved'
      );

      if (!data) {
        setError('Failed to save projects listing SEO');
        return;
      }

      setListingSeo(data.content.projectsListingSeo);
      setKeywordsText(data.content.projectsListingSeo.keywords.join(', '));
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'Projects SEO',
        description: 'SEO for the Bold Brand Studio /projects listing page',
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
            Loading projects listing SEO…
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

            <RegularInput
              label="Meta title"
              value={listingSeo.metaTitle}
              onChange={e => setListingSeo(c => ({ ...c, metaTitle: e.target.value }))}
            />

            <RegularTextarea
              label="Meta description"
              value={listingSeo.metaDescription}
              onChange={e => setListingSeo(c => ({ ...c, metaDescription: e.target.value }))}
              rows={3}
              subtext="Leave empty to fall back to the site default description"
            />

            <RegularInput
              label="Keywords"
              value={keywordsText}
              onChange={e => setKeywordsText(e.target.value)}
              subtext="Comma-separated"
            />

            <ImageUpload
              label="Open Graph / Twitter image"
              value={listingSeo.ogImageUrl || undefined}
              previewUrl={ogUpload.previewUrl || undefined}
              uploading={ogUpload.loading}
              progress={ogUpload.progress}
              aspectRatio="16/9"
              onFileSelect={file => {
                ogUpload.handleFileSelect(file);
                if (file) void ogUpload.uploadFile({ file });
              }}
              onClear={() => {
                ogUpload.handleFileSelect(null);
                setListingSeo(c => ({ ...c, ogImageUrl: '' }));
              }}
            />
            <RegularInput
              label="OG image URL"
              value={listingSeo.ogImageUrl}
              onChange={e => setListingSeo(c => ({ ...c, ogImageUrl: e.target.value }))}
              subtext="Leave empty to fall back to the site default OG image"
            />
          </form>
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
};
