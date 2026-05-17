import { Skeleton } from '@/components/ui/skeleton';

/** Matches project/service listing card layout (image + title, description, tags, CTA). */
export function PublicListingCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-10 rounded" />
        </div>
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
