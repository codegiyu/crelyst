import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingRegion } from './LoadingRegion';

export function ProjectDetailContentSkeleton() {
  return (
    <LoadingRegion label="Loading project details">
      <SectionContainer customContainer>
        <Skeleton className="aspect-video w-full rounded-2xl" />
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-lg border border-border bg-muted/30 p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-6 w-40" />
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid gap-3">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </SectionContainer>

      <SectionContainer>
        <Skeleton className="mb-4 h-9 w-64" />
        <div className="grid max-w-none gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </SectionContainer>

      <SectionContainer background="muted" customContainer>
        <Skeleton className="mb-8 h-9 w-48" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </SectionContainer>
    </LoadingRegion>
  );
}
