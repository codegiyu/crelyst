'use client';

import { cn } from '@/lib/utils';
import { Input, type InputProps } from '../ui/input';
import { FocusEvent, ReactNode, useImperativeHandle, useRef } from 'react';
import { InputWrapper, useFieldControl } from '../general/InputWrapper';
import { getFieldControlAriaProps, getFieldErrorClass } from '@/lib/utils/fieldControlProps';
import { GhostBtn } from './GhostBtn';
import { Calendar } from 'lucide-react';

export interface RegularInputProps extends InputProps {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
  bottomText?: ReactNode;
  endAdornment?: ReactNode;
  fieldId?: string;
}

export const RegularInput = ({
  className,
  type,
  label,
  subtext,
  labelClassName,
  wrapClassName,
  placeholder,
  ref,
  required,
  onFocus,
  onBlur,
  errors = [],
  endAdornment,
  fieldId,
  ...props
}: RegularInputProps) => {
  const localRef = useRef<HTMLInputElement>(null);

  // Assign the incoming ref to the local ref
  useImperativeHandle(ref, () => localRef.current!);

  const hasError = errors.length > 0;

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}
      fieldId={fieldId}>
      <RegularInputControl
        className={className}
        type={type}
        placeholder={placeholder}
        localRef={localRef}
        hasError={hasError}
        onFocus={onFocus}
        onBlur={onBlur}
        endAdornment={endAdornment}
        {...props}
      />
    </InputWrapper>
  );
};

function RegularInputControl({
  className,
  type,
  placeholder,
  localRef,
  hasError,
  onFocus,
  onBlur,
  endAdornment,
  ...props
}: RegularInputProps & {
  localRef: React.RefObject<HTMLInputElement | null>;
  hasError: boolean;
}) {
  const field = useFieldControl();
  const ariaProps = getFieldControlAriaProps(field, hasError ? [''] : []);

  const openDatePicker = () => {
    if (localRef.current) {
      localRef.current.showPicker();
    }
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        type={type}
        className={cn(getFieldErrorClass(hasError), className)}
        ref={localRef}
        {...ariaProps}
        {...props}
        onFocus={(e: FocusEvent<HTMLInputElement>) => {
          if (onFocus) onFocus(e);
        }}
        onBlur={(e: FocusEvent<HTMLInputElement>) => {
          if (onBlur) onBlur(e);
        }}
      />
      {type === 'date' && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 h-auto w-fit flex items-center justify-end bg-background">
          <GhostBtn
            onClick={openDatePicker}
            type="button"
            className="pl-12 py-3 pr-4"
            LucideIcon={Calendar}
            iconClass="text-base md:text-xl text-muted-foreground"
          />
        </div>
      )}
      {endAdornment}
    </div>
  );
}
