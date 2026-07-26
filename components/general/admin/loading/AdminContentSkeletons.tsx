import { Skeleton } from '@/components/ui/skeleton';
import { AdminLoadingRegion, AdminSkeletonGrid } from './AdminLoadingRegion';

/** Services / projects: tall media card + title/description. */
export function AdminMediaCardGridSkeleton({
  label = 'Loading cards',
  count = 6,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label}>
      <AdminSkeletonGrid className="md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="p-4 grid gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </AdminSkeletonGrid>
    </AdminLoadingRegion>
  );
}

/** Brands: shorter logo panel + name row. */
export function AdminLogoCardGridSkeleton({
  label = 'Loading brands',
  count = 6,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label}>
      <AdminSkeletonGrid className="md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Skeleton className="h-32 w-full rounded-none" />
            <div className="p-4 grid gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        ))}
      </AdminSkeletonGrid>
    </AdminLoadingRegion>
  );
}

/** Portfolio case studies: 16:10 media + text. */
export function AdminPortfolioCardGridSkeleton({
  label = 'Loading portfolio',
  count = 6,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label}>
      <AdminSkeletonGrid className="md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="p-4 grid gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </AdminSkeletonGrid>
    </AdminLoadingRegion>
  );
}

/** Team: portrait cards. */
export function AdminTeamCardGridSkeleton({
  label = 'Loading team members',
  count = 4,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label}>
      <AdminSkeletonGrid className="sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Skeleton className="aspect-[0.85] w-full rounded-none" />
            <div className="p-4 grid gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </AdminSkeletonGrid>
    </AdminLoadingRegion>
  );
}

/** Testimonials: avatar header + quote body. */
export function AdminTestimonialCardGridSkeleton({
  label = 'Loading testimonials',
  count = 6,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label}>
      <AdminSkeletonGrid className="md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card shadow-sm overflow-hidden p-4 grid gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="grid gap-2 flex-1 min-w-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </AdminSkeletonGrid>
    </AdminLoadingRegion>
  );
}

/** Inbox: filter + stacked submission cards. */
export function AdminInboxListSkeleton({
  label = 'Loading submissions',
  count = 4,
}: {
  label?: string;
  count?: number;
}) {
  return (
    <AdminLoadingRegion label={label} className="grid gap-6">
      <Skeleton className="h-10 max-w-md w-full" />
      <Skeleton className="h-4 w-32" />
      <ul className="flex flex-col gap-4">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-3 p-6 pb-2">
              <div className="grid gap-2 min-w-0 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="p-6 pt-2 grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AdminLoadingRegion>
  );
}

/** Audit log: summary line + table shell. */
export function AdminAuditTableSkeleton({
  label = 'Loading audit log',
  rows = 8,
}: {
  label?: string;
  rows?: number;
}) {
  return (
    <AdminLoadingRegion label={label} className="grid gap-6">
      <Skeleton className="h-4 w-40" />
      <div className="rounded-xl border overflow-hidden">
        <div className="border-b bg-muted/50 p-3 grid grid-cols-6 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="p-3 grid grid-cols-6 gap-3 items-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </AdminLoadingRegion>
  );
}

/** Settings tab: form-shaped panel. */
export function AdminSettingsFormSkeleton({ label = 'Loading settings' }: { label?: string }) {
  return (
    <AdminLoadingRegion label={label}>
      <div className="rounded-xl border bg-card shadow-sm p-6 grid gap-6">
        <div className="grid gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </AdminLoadingRegion>
  );
}
