import { cn } from '@/lib/utils';
import { Header } from './Header';
import { ReactNode } from 'react';
import { Footer } from './Footer';
import { ScrollToTop } from '../general/ScrollToTop';
import type { PublicFooterSettings } from '@/lib/types/public-layout';

export interface MainLayoutProps {
  children?: ReactNode;
  className?: string;
  /** Hide the header */
  hideHeader?: boolean;
  /** Hide the footer */
  hideFooter?: boolean;
  /** Hide the scroll to top button */
  hideScrollToTop?: boolean;
  /** Make header transparent on load (becomes opaque after scrolling) */
  transparentHeader?: boolean;
  /** SSR site settings for footer */
  footerSettings?: PublicFooterSettings;
}

export const MainLayout = ({
  children,
  className,
  hideHeader = false,
  hideFooter = false,
  hideScrollToTop = false,
  transparentHeader = false,
  footerSettings,
}: MainLayoutProps) => {
  return (
    <>
      {!hideHeader && <Header transparentOnLoad={transparentHeader} />}
      <main className={cn('min-h-screen min-w-0 overflow-x-clip', className)}>
        {children}
        {!hideScrollToTop && <ScrollToTop />}
      </main>
      {!hideFooter && <Footer initialSettings={footerSettings} />}
    </>
  );
};
