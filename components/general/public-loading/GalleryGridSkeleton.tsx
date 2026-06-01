import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { Skeleton } from '@/components/ui/skeleton';

type GalleryGridSkeletonProps = {
  label?: string;
  count?: number;
};

export function GalleryGridSkeleton({
  label = 'Loading gallery',
  count = 8,
}: GalleryGridSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <span className="sr-only">{label}</span>
      <SectionContainer background="default" fullWidth>
        <SectionHeading
          immediate
          caption="Gallery"
          title="Our Work Gallery"
          text="A showcase of our projects and services"
        />
        <div className="mt-12 grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: count }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
