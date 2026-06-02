import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Hero placeholder for project detail (banner + title block + hero image). */
export function ProjectDetailHeroSkeleton() {
  return (
    <header className="relative w-full">
      <div
        className={cn(
          'relative z-10 flex min-h-[min(560px,60vh)] items-center',
          'bg-gradient-to-br from-accent/5 via-background to-primary/5'
        )}>
        <div className="absolute inset-0 pattern-overlay pointer-events-none" />
        <SectionContainer className="relative z-10 w-full">
          <div className="content-prose-center text-center">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <Skeleton className="mb-4 h-12 w-full max-w-xl md:h-14" />
            <Skeleton className="mb-3 h-12 w-4/5 max-w-lg md:h-14" />
            <Skeleton className="mb-8 h-5 w-full max-w-2xl" />
            <Skeleton className="h-5 w-64" />
          </div>
        </SectionContainer>
      </div>

      <div className="regular-container mt-12 md:mt-16">
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </header>
  );
}
