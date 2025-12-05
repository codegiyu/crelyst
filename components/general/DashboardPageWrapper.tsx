import { PropsWithChildren, ReactNode } from 'react';
import { PageHeader, PageHeaderProps } from './PageHeader';
import { cn } from '@/lib/utils';

export interface DashboardPageWrapperProps extends PropsWithChildren {
  /** Page header configuration */
  header: Omit<PageHeaderProps, 'children'>;
  /** Actions to display in the header (buttons, etc.) */
  headerActions?: ReactNode;
  /** Additional className for the wrapper */
  className?: string;
  /** Additional className for the content area */
  contentClassName?: string;
}

export function DashboardPageWrapper({
  header,
  headerActions,
  children,
  className,
  contentClassName,
}: DashboardPageWrapperProps) {
  return (
    <div className={cn('space-y-6 overflow-hidden', className)}>
      <PageHeader {...header}>{headerActions}</PageHeader>
      <div className={cn(contentClassName)}>{children}</div>
    </div>
  );
}
