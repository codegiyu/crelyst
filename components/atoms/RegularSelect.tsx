import { type SelectOption } from '@/lib/types/general';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';
import { InputWrapper, useFieldControl } from '../general/InputWrapper';
import { getFieldControlAriaProps, getFieldErrorClass } from '@/lib/utils/fieldControlProps';
import { ComponentPropsWithRef, FocusEvent, ReactNode } from 'react';

export interface RegularSelectProps extends Omit<ComponentPropsWithRef<'div'>, 'className'> {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  value: string;
  name?: string;
  placeholder?: string;
  className?: string;
  onSelectChange: (value: string) => void;
  optionsTitle?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  wrapClassName?: string;
  triggerClassName?: string;
  valueClassName?: string;
  hideCaretIfDisabled?: boolean;
  errors?: string[];
  fieldId?: string;
}

export const RegularSelect = ({
  label = '',
  subtext,
  labelClassName = '',
  value,
  name,
  placeholder = '',
  className = '',
  onSelectChange,
  optionsTitle,
  options,
  disabled = false,
  wrapClassName = '',
  triggerClassName = '',
  valueClassName = '',
  hideCaretIfDisabled,
  required,
  onFocus,
  onBlur,
  errors = [],
  fieldId,
  ...props
}: RegularSelectProps) => {
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
      <RegularSelectControl
        hasError={hasError}
        value={value}
        name={name}
        placeholder={placeholder}
        className={className}
        onSelectChange={onSelectChange}
        optionsTitle={optionsTitle}
        options={options}
        disabled={disabled}
        triggerClassName={triggerClassName}
        valueClassName={valueClassName}
        hideCaretIfDisabled={hideCaretIfDisabled}
        onFocus={onFocus}
        onBlur={onBlur}
        {...props}
      />
    </InputWrapper>
  );
};

function RegularSelectControl({
  hasError,
  value,
  name,
  placeholder,
  className,
  onSelectChange,
  optionsTitle,
  options,
  disabled,
  triggerClassName,
  valueClassName,
  hideCaretIfDisabled,
  onFocus,
  onBlur,
  ...props
}: RegularSelectProps & { hasError: boolean }) {
  const field = useFieldControl();
  const ariaProps = getFieldControlAriaProps(field, hasError ? [''] : []);

  return (
    <SelectGroup
      onFocus={(e: FocusEvent<HTMLDivElement>) => {
        if (onFocus) onFocus(e);
      }}
      onBlur={(e: FocusEvent<HTMLDivElement>) => {
        if (onBlur) onBlur(e);
      }}
      className={cn('w-full flex items-center', className)}
      {...props}>
      <Select value={value} onValueChange={value => value && onSelectChange(value)} name={name}>
        <SelectTrigger
          disabled={disabled}
          hidecaretifdisabled={hideCaretIfDisabled}
          id={ariaProps.id}
          aria-invalid={ariaProps['aria-invalid']}
          aria-describedby={ariaProps['aria-describedby']}
          className={cn(getFieldErrorClass(hasError), triggerClassName)}>
          <SelectValue
            className={cn('', valueClassName)}
            placeholder={
              <span className="block text-start text-muted-foreground">{placeholder}</span>
            }
          />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          position="popper"
          className="rounded-[6px] border-border p-2 shadow-md outline-hidden">
          {optionsTitle && (
            <SelectLabel className="py-1 px-3 text-sm font-medium text-muted-foreground">
              {optionsTitle}
            </SelectLabel>
          )}
          {options.map(({ text, altText, value, disabled = false }, idx) => (
            <SelectItem key={idx} value={value} disabled={disabled} className="overflow-hidden">
              <div className="flex w-full items-center gap-3 overflow-hidden">
                <span className={cn('text-foreground truncate', valueClassName)}>
                  {altText || text}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SelectGroup>
  );
}
