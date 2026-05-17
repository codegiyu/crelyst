import { SectionContainer } from '@/components/general/SectionContainer';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/** Hero placeholder for service detail (icon + title + description on gradient). */
export function ServiceDetailHeroSkeleton() {
  return (
    <div className="relative w-full">
      <div
        className={cn(
          'relative z-10 flex min-h-[min(900px,75vh)] items-center',
          'bg-gradient-to-br from-primary/5 via-background to-accent/5'
        )}>
        <div className="absolute inset-0 pattern-overlay pointer-events-none" />
        <SectionContainer className="relative z-10 w-full">
          <div className="regular-container w-full text-center">
            <Skeleton className="mx-auto mb-6 h-20 w-20 rounded-2xl" />
            <Skeleton className="mx-auto mb-4 h-12 w-full max-w-xl md:h-14" />
            <Skeleton className="mx-auto mb-3 h-12 w-3/4 max-w-lg md:h-14" />
            <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
            <Skeleton className="mx-auto mt-2 h-5 w-4/5 max-w-xl" />
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
