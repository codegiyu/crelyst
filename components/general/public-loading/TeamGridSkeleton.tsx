import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeading } from '@/components/general/SectionHeading';
import { TeamMemberCardSkeleton } from './TeamMemberCardSkeleton';

type TeamGridSkeletonProps = {
  label?: string;
  count?: number;
};

export function TeamGridSkeleton({
  label = 'Loading team members',
  count = 4,
}: TeamGridSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <span className="sr-only">{label}</span>
      <SectionContainer background="muted">
        <SectionHeading
          immediate
          title="Meet Our Team"
          text="The talented people behind our success"
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: count }, (_, i) => (
            <TeamMemberCardSkeleton key={i} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}
