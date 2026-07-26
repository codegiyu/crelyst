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
  <div className="grid gap-4" aria-busy="true" aria-label="Loading">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <Skeleton className="h-40 w-full rounded-none" />
          <div className="p-4 grid gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
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
