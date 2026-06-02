import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingRegion } from './LoadingRegion';

export function ServiceDetailContentSkeleton() {
  return (
    <LoadingRegion label="Loading service details">
      <SectionContainer>
        <div className="content-prose-center mx-auto grid gap-3">
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-5/6" />
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          <Skeleton className="min-h-[280px] rounded-2xl md:min-h-[320px]" />
          <Skeleton className="min-h-[280px] rounded-2xl md:min-h-[320px]" />
        </div>
      </SectionContainer>

      <SectionContainer background="muted">
        <Skeleton className="mx-auto mb-12 h-9 w-56" />
        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <Skeleton className="mb-5 h-6 w-32" />
              <div className="grid gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <Skeleton className="mx-auto mb-12 h-9 w-40" />
        <div className="relative content-prose-center mx-auto grid gap-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex gap-6">
              <Skeleton className="h-10 w-10 flex-none rounded-full" />
              <div className="flex-1 grid gap-2 pt-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </LoadingRegion>
  );
}
