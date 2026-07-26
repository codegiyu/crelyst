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

const emptySeo = (): ClientBbsSiteContent['seo'] => ({
  metaTitle: '',
  metaDescription: '',
  siteName: '',
  ogImageUrl: '',
  faviconUrl: '',
});

export const PortfolioSeoPageClient = () => {
  const resource = useAdminResource({
    resourceKey: ['admin', 'bbs-site-content'],
    endpoint: 'ADMIN_GET_BBS_SITE_CONTENT',
    sectionLabel: 'Bold Brand Studio SEO',
  });

  const [seo, setSeo] = useState<ClientBbsSiteContent['seo']>(emptySeo);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resource.data?.content.seo) {
      setSeo(resource.data.content.seo);
    }
  }, [resource.data]);

  const ogUpload = useFileUpload({
    entityType: 'bbs-site-content',
    entityId: 'content',
    intent: 'banner-image',
    onUploadComplete: url => {
      setSeo(current => ({ ...current, ogImageUrl: url }));
    },
  });

  const faviconUpload = useFileUpload({
    entityType: 'bbs-site-content',
    entityId: 'content',
    intent: 'logo',
    onUploadComplete: url => {
      setSeo(current => ({ ...current, faviconUrl: url }));
    },
  });

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const payloadSeo = {
        ...seo,
        metaTitle: seo.metaTitle.trim(),
        metaDescription: seo.metaDescription.trim(),
        siteName: seo.siteName.trim(),
        ogImageUrl: seo.ogImageUrl.trim(),
        faviconUrl: seo.faviconUrl.trim(),
      };

      const data = await adminCallApiToast(
        'Saving SEO settings…',
        () =>
          callApi('ADMIN_UPDATE_BBS_SITE_CONTENT', {
            payload: { seo: payloadSeo },
          }),
        'SEO settings saved'
      );

      if (!data) {
        setError('Failed to save SEO settings');
        return;
      }

      setSeo(data.content.seo);
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardPageWrapper
      header={{
        title: 'SEO',
        description: 'Default title, description, share image, and favicon for Bold Brand Studio',
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
            Loading SEO settings…
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
                label="Meta title"
                value={seo.metaTitle}
                onChange={e => setSeo(c => ({ ...c, metaTitle: e.target.value }))}
              />
              <RegularInput
                label="Site name"
                value={seo.siteName}
                onChange={e => setSeo(c => ({ ...c, siteName: e.target.value }))}
                subtext="Used for og:site_name and twitter:creator"
              />
            </div>

            <RegularTextarea
              label="Meta description"
              value={seo.metaDescription}
              onChange={e => setSeo(c => ({ ...c, metaDescription: e.target.value }))}
              rows={3}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="grid gap-3">
                <ImageUpload
                  label="Open Graph / Twitter image"
                  value={seo.ogImageUrl || undefined}
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
                    setSeo(c => ({ ...c, ogImageUrl: '' }));
                  }}
                />
                <RegularInput
                  label="OG image URL"
                  value={seo.ogImageUrl}
                  onChange={e => setSeo(c => ({ ...c, ogImageUrl: e.target.value }))}
                />
              </div>

              <div className="grid gap-3">
                <ImageUpload
                  label="Favicon"
                  value={seo.faviconUrl || undefined}
                  previewUrl={faviconUpload.previewUrl || undefined}
                  uploading={faviconUpload.loading}
                  progress={faviconUpload.progress}
                  aspectRatio="1/1"
                  accept="image/png,image/x-icon,image/svg+xml,image/webp,image/*"
                  onFileSelect={file => {
                    faviconUpload.handleFileSelect(file);
                    if (file) void faviconUpload.uploadFile({ file });
                  }}
                  onClear={() => {
                    faviconUpload.handleFileSelect(null);
                    setSeo(c => ({ ...c, faviconUrl: '' }));
                  }}
                />
                <RegularInput
                  label="Favicon URL"
                  value={seo.faviconUrl}
                  onChange={e => setSeo(c => ({ ...c, faviconUrl: e.target.value }))}
                />
              </div>
            </div>
          </form>
        </div>
      </AdminAsyncSection>
    </DashboardPageWrapper>
  );
};
