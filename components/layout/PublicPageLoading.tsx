import type { ReactNode } from 'react';
import { PublicShell } from '@/components/layout/PublicShell';

type PublicPageLoadingProps = {
  children: ReactNode;
  transparentHeader?: boolean;
};

/** Wraps public route loading UI with header/footer shell (footer settings fetched here). */
export async function PublicPageLoading({ children, transparentHeader }: PublicPageLoadingProps) {
  return <PublicShell transparentHeader={transparentHeader}>{children}</PublicShell>;
}
