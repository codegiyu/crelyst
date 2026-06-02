import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type StyleguideSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export const StyleguideSection = ({
  id,
  title,
  description,
  children,
  className,
}: StyleguideSectionProps) => {
  return (
    <section
      id={id}
      className={cn('scroll-mt-24 border-b border-border pb-16 mb-16 last:mb-0', className)}>
      <header className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">{title}</h2>
        {description ? (
          <p className="content-prose mt-2 text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
};

export const StyleguidePreviewBox = ({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('rounded-xl border border-border bg-card/50 overflow-hidden', className)}>
      {label ? (
        <div className="px-4 py-2 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      ) : null}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
};
