import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminAuthLoadingProps = {
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

export function AdminAuthLoading({
  label = 'Loading…',
  fullScreen = true,
  className,
}: AdminAuthLoadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'min-h-dvh w-full bg-background',
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
