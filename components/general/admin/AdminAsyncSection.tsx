'use client';

import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminSectionError } from '@/components/general/admin/AdminSectionError';
import type { AdminLoadStatus } from '@/lib/admin/adminResourceState';

export type AdminAsyncSectionProps = {
  status: AdminLoadStatus;
  errorMessage: string | null;
  onRetry: () => void;
  children: ReactNode;
  /** Shown while idle or loading (before first success) */
  loadingFallback?: ReactNode;
  /** When true and status is error but prior data exists, still render children below the error */
  showChildrenOnError?: boolean;
  hasData?: boolean;
};

const DefaultLoading = () => (
  <div className="grid gap-3" aria-busy="true" aria-label="Loading">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-24 w-full" />
  </div>
);

export function AdminAsyncSection({
  status,
  errorMessage,
  onRetry,
  children,
  loadingFallback,
  showChildrenOnError = false,
  hasData = false,
}: AdminAsyncSectionProps) {
  const showLoading = status === 'idle' || (status === 'loading' && !hasData);

  if (showLoading) {
    return <>{loadingFallback ?? <DefaultLoading />}</>;
  }

  if (status === 'error') {
    return (
      <div className="grid gap-4">
        <AdminSectionError message={errorMessage ?? 'Something went wrong.'} onRetry={onRetry} />
        {showChildrenOnError && hasData ? children : null}
      </div>
    );
  }

  return <>{children}</>;
}
