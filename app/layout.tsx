import type { Metadata, Viewport } from 'next';
import type { CSSProperties } from 'react';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ScrollRestorationHandler } from '@/components/general/ScrollRestorationHandler';
import { LoadAnimationScreen } from '@/components/general/LoadAnimationScreen';
import { getSettingsSlice } from '@/app/_server/controllers/site/fetchSettings';
import {
  buildBrandingCssVariables,
  buildRootMetadataFromSettings,
  resolveSiteFaviconUrl,
} from '@/lib/utils/siteLayoutSettings';

export async function generateMetadata(): Promise<Metadata> {
  const [seoSlice, brandingSlice] = await Promise.all([
    getSettingsSlice('seo', false),
    getSettingsSlice('branding', false),
  ]);

  const metadata = buildRootMetadataFromSettings(seoSlice?.seo);
  const faviconUrl = resolveSiteFaviconUrl(seoSlice?.seo, brandingSlice?.branding);

  return {
    ...metadata,
    icons: {
      icon: faviconUrl,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

/** Always render on request so CMS/admin updates are not served from the full route cache. */
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brandingSlice = await getSettingsSlice('branding', false);
  const brandingVariables = buildBrandingCssVariables(brandingSlice?.branding);
  const brandingStyle = brandingVariables as CSSProperties;

  return (
    <html lang="en" suppressHydrationWarning style={brandingStyle}>
      <body className={`antialiased`}>
        <ScrollRestorationHandler />
        <LoadAnimationScreen />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
