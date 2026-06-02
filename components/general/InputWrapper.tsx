'use client';

import { cn } from '@/lib/utils';
import {
  ComponentPropsWithRef,
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useId,
  useMemo,
} from 'react';

export type FieldControlContextValue = {
  controlId: string;
  errorId: string;
  hasError: boolean;
};

const FieldControlContext = createContext<FieldControlContextValue | null>(null);

export function useFieldControl() {
  return useContext(FieldControlContext);
}

export type InputWrapperProps = PropsWithChildren<{
  wrapClassName?: string;
  label?: string;
  subtext?: ReactNode;
  labelTextClassName?: string;
  required?: boolean;
  errors?: string[];
  /** Stable id for the control; auto-generated when omitted */
  fieldId?: string;
  otherLabelProps?: Omit<ComponentPropsWithRef<'label'>, 'className' | 'htmlFor'>;
}>;

export const InputWrapper = ({
  children,
  wrapClassName,
  label,
  subtext,
  labelTextClassName,
  otherLabelProps,
  required,
  errors = [],
  fieldId,
}: InputWrapperProps) => {
  const autoId = useId();
  const controlId = fieldId ?? `field-${autoId.replace(/:/g, '')}`;
  const errorId = `${controlId}-error`;
  const hasError = errors.length > 0;
  const firstError = errors[0];

  const contextValue = useMemo(
    () => ({ controlId, errorId, hasError }),
    [controlId, errorId, hasError]
  );

  return (
    <FieldControlContext.Provider value={contextValue}>
      <div className={cn('w-full', wrapClassName)}>
        <div className="flex flex-col justify-center gap-2">
          {label ? (
            <label
              htmlFor={controlId}
              className={cn(
                'text-[0.75rem] leading-[1.2] font-medium text-foreground font-inter',
                labelTextClassName
              )}
              {...otherLabelProps}>
              {label}
              {required ? ' *' : ''}
              {subtext ? (
                <span className="text-muted-foreground font-normal ml-1">{subtext}</span>
              ) : null}
            </label>
          ) : null}
          <div className="relative w-full">{children}</div>
        </div>
        {hasError ? (
          <p id={errorId} role="alert" className={cn('text-xs md:text-sm text-destructive mt-1')}>
            {firstError}
          </p>
        ) : null}
      </div>
    </FieldControlContext.Provider>
  );
};
