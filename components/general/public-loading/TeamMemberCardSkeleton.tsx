import { Skeleton } from '@/components/ui/skeleton';

export function TeamMemberCardSkeleton() {
  return (
    <div className="text-center">
      <Skeleton className="mb-4 aspect-[3/4] w-full rounded-xl" />
      <Skeleton className="mx-auto h-5 w-32" />
      <Skeleton className="mx-auto mt-2 h-4 w-24" />
      <Skeleton className="mx-auto mt-2 h-4 w-full max-w-[200px]" />
    </div>
  );
}
