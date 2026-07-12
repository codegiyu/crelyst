import type { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import type { PublicFooterSettings } from '@/lib/types/public-layout';
import { serverFetchJsonOrNull } from '@/app/_server/lib/api/serverFetch';
import type { ClientSiteSettings } from '@/lib/constants/endpoints';

async function loadFooterSettings(): Promise<PublicFooterSettings> {
  const [contactInfo, socials, appDetails] = await Promise.all([
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'contactInfo'>>(
      '/api/site-settings/contactInfo'
    ),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'socials'>>('/api/site-settings/socials'),
    serverFetchJsonOrNull<Pick<ClientSiteSettings, 'appDetails'>>('/api/site-settings/appDetails'),
  ]);
  return {
    ...(contactInfo.ok ? contactInfo.data : {}),
    ...(socials.ok ? socials.data : {}),
    ...(appDetails.ok ? appDetails.data : {}),
  };
}

type PublicShellProps = {
  children: ReactNode;
  transparentHeader?: boolean;
  /** When set, skips internal footer fetches (e.g. parent already loaded slices). */
  footerSettings?: PublicFooterSettings;
};

export async function PublicShell({
  children,
  transparentHeader,
  footerSettings: footerFromParent,
}: PublicShellProps) {
  const footerSettings = footerFromParent ?? (await loadFooterSettings());

  return (
    <MainLayout transparentHeader={transparentHeader} footerSettings={footerSettings}>
      {children}
    </MainLayout>
  );
}
