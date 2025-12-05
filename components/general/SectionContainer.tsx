import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'default' | 'muted' | 'primary';
  customContainer?: boolean;
}

const backgroundClasses = {
  default: '',
  muted: 'bg-muted/30',
  primary: 'bg-primary text-primary-foreground',
};

/**
 * Reusable section container wrapper with consistent padding and container styling
 */
export const SectionContainer = ({
  children,
  className,
  containerClassName,
  background = 'default',
  customContainer = false,
}: SectionContainerProps) => {
  return (
    <section className={cn('w-full section-padding', backgroundClasses[background], className)}>
      <div
        className={cn(
          customContainer ? 'container-custom' : 'regular-container',
          containerClassName
        )}>
        {children}
      </div>
    </section>
  );
};
