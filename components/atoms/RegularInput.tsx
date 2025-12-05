'use client';

import { cn } from '@/lib/utils';
import { Input, type InputProps } from '../ui/input';
import { FocusEvent, ReactNode, useImperativeHandle, useRef } from 'react';
import { InputWrapper } from '../general/InputWrapper';
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
  ...props
}: RegularInputProps) => {
  const localRef = useRef<HTMLInputElement>(null);

  // Assign the incoming ref to the local ref
  useImperativeHandle(ref, () => localRef.current!);

  const openDatePicker = () => {
    if (localRef.current) {
      localRef.current.showPicker();
    }
  };
  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={type}
          className={cn('', className)}
          ref={localRef}
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
    </InputWrapper>
  );
};
