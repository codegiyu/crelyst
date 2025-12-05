import { cn } from '@/lib/utils';
import { Textarea, type TextareaProps } from '../ui/textarea';
import { FocusEvent, ReactNode } from 'react';
import { InputWrapper } from '../general/InputWrapper';

export interface RegularTextareaProps extends TextareaProps {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
}

export const RegularTextarea = ({
  className,
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
  ...props
}: RegularTextareaProps) => {
  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <Textarea
        placeholder={placeholder}
        className={cn('', className)}
        ref={ref}
        {...props}
        onFocus={(e: FocusEvent<HTMLTextAreaElement>) => {
          if (onFocus) onFocus(e);
        }}
        onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
          if (onBlur) onBlur(e);
        }}
      />
    </InputWrapper>
  );
};
