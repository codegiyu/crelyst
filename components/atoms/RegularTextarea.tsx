import { cn } from '@/lib/utils';
import { Textarea, type TextareaProps } from '../ui/textarea';
import { FocusEvent, ReactNode } from 'react';
import { InputWrapper, useFieldControl } from '../general/InputWrapper';
import { getFieldControlAriaProps, getFieldErrorClass } from '@/lib/utils/fieldControlProps';

export interface RegularTextareaProps extends TextareaProps {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
  fieldId?: string;
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
  fieldId,
  ...props
}: RegularTextareaProps) => {
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
      <RegularTextareaControl
        className={className}
        placeholder={placeholder}
        ref={ref}
        hasError={hasError}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    </InputWrapper>
  );
};

function RegularTextareaControl({
  className,
  placeholder,
  ref,
  hasError,
  onFocus,
  onBlur,
  ...props
}: RegularTextareaProps & { hasError: boolean }) {
  const field = useFieldControl();
  const ariaProps = getFieldControlAriaProps(field, hasError ? [''] : []);

  return (
    <Textarea
      placeholder={placeholder}
      className={cn(getFieldErrorClass(hasError), className)}
      ref={ref}
      {...ariaProps}
      {...props}
      onFocus={(e: FocusEvent<HTMLTextAreaElement>) => {
        if (onFocus) onFocus(e);
      }}
      onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
        if (onBlur) onBlur(e);
      }}
    />
  );
}
