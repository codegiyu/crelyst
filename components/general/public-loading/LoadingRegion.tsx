import type { ReactNode } from 'react';

type LoadingRegionProps = {
  label: string;
  children: ReactNode;
};

export function LoadingRegion({ label, children }: LoadingRegionProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
