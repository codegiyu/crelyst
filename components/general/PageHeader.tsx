import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps extends PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}>
      <div className="grid min-w-0 gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
          {children}
        </div>
      ) : null}
    </div>
  );
}
