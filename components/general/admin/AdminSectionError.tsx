'use client';

import { AlertTriangle } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';

export type AdminSectionErrorProps = {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
  className?: string;
};

export function AdminSectionError({
  message,
  onRetry,
  retryLabel = 'Retry',
  className,
}: AdminSectionErrorProps) {
  return (
    <div
      role="alert"
      className={
        className ??
        'flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive'
      }>
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="space-y-2">
        <p>{message}</p>
        <RegularBtn text={retryLabel} size="sm" variant="outline" onClick={onRetry} />
      </div>
    </div>
  );
}
