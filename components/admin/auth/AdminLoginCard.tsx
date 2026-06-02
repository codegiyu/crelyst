import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AdminLoginCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminLoginCard({ title, description, children, className }: AdminLoginCardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8',
        className
      )}>
      <div className="mb-6 grid gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Admin console</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
