'use client';

import { SectionHeading } from '@/components/general/SectionHeading';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import type { ReactNode } from 'react';

export type PublicFormPanelProps = {
  caption: string;
  title: string;
  description: string;
  children: ReactNode;
  submitted?: boolean;
  successTitle?: string;
  successMessage?: string;
  successActionLabel?: string;
  onSuccessAction?: () => void;
  className?: string;
  headingAlign?: 'start' | 'center';
};

export function PublicFormPanel({
  caption,
  title,
  description,
  children,
  submitted = false,
  successTitle = 'Thank you!',
  successMessage = 'Your submission was received. We will get back to you soon.',
  successActionLabel = 'Submit another',
  onSuccessAction,
  className,
  headingAlign = 'start',
}: PublicFormPanelProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-none',
        className
      )}>
      <SectionHeading
        caption={caption}
        title={title}
        text={description}
        variant="compact"
        align={headingAlign}
        spacing="tight"
        className={cn('mb-16', headingAlign === 'center' ? 'max-md:text-center' : undefined)}
      />

      {submitted ? (
        <div
          className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-6 py-8 text-center"
          role="status"
          aria-live="polite">
          <CheckCircle2 className="mx-auto mb-4 size-12 text-primary" aria-hidden />
          <h3 className="text-xl font-semibold font-heading text-foreground">{successTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{successMessage}</p>
          {onSuccessAction ? (
            <RegularBtn
              type="button"
              variant="outline"
              className="mt-6"
              text={successActionLabel}
              onClick={onSuccessAction}
            />
          ) : null}
        </div>
      ) : (
        <div className="mt-8">{children}</div>
      )}
    </div>
  );
}
