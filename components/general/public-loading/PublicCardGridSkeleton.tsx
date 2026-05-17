import { SectionContainer } from '@/components/general/SectionContainer';
import { LoadingRegion } from './LoadingRegion';
import { PublicListingCardSkeleton } from './PublicListingCardSkeleton';

type PublicCardGridSkeletonProps = {
  /** Screen-reader label for the loading region. */
  label: string;
  count?: number;
};

export function PublicCardGridSkeleton({ label, count = 6 }: PublicCardGridSkeletonProps) {
  return (
    <LoadingRegion label={label}>
      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <PublicListingCardSkeleton key={i} />
          ))}
        </div>
      </SectionContainer>
    </LoadingRegion>
  );
}
