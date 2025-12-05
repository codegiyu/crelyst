import { cn } from '@/lib/utils';
import { Header } from './Header';
import { ReactNode } from 'react';
import { Footer } from './Footer';
import { ScrollToTop } from '../general/ScrollToTop';

export interface MainLayoutProps {
  children?: ReactNode;
  className?: string;
  /** Hide the header */
  hideHeader?: boolean;
  /** Hide the footer */
  hideFooter?: boolean;
  /** Hide the scroll to top button */
  hideScrollToTop?: boolean;
}

export const MainLayout = ({
  children,
  className,
  hideHeader = false,
  hideFooter = false,
  hideScrollToTop = false,
}: MainLayoutProps) => {
  return (
    <>
      {!hideHeader && <Header />}
      <main className={cn('min-h-screen', className)}>
        {children}
        {!hideScrollToTop && <ScrollToTop />}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};
