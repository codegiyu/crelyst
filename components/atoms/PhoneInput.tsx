/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { FocusEvent, ReactNode, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { InputWrapper } from '../general/InputWrapper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  cleanPhoneInput,
  COUNTRIES,
  Country,
  DEFAULT_COUNTRY,
  findCountryFromPhoneNumber,
  getCountryByCode,
  formatPhoneValue,
  stripCountryCode,
} from '@/lib/constants/phone-numbers';

export interface PhoneInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
  bottomText?: ReactNode;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const PhoneInput = ({
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
  value = '',
  onChange,
  name,
  disabled,
  ...props
}: PhoneInputProps) => {
  const localRef = useRef<HTMLInputElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [inputValue, setInputValue] = useState('');

  // Assign the incoming ref to the local ref
  useImperativeHandle(ref, () => localRef.current!);

  const handleCountryChange = (countryCode: string) => {
    const country = getCountryByCode(countryCode) || DEFAULT_COUNTRY;
    setSelectedCountry(country);

    // Reformat the current input with new country code
    const finalValue = formatPhoneValue(country.dialCode, inputValue);
    if (onChange) {
      onChange({
        target: {
          value: finalValue,
          name: name,
        },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;

    // Clean the input - allow digits, spaces, hyphens, brackets
    const cleaned = cleanPhoneInput(rawInput);

    // Strip country code if present
    const phoneWithoutCode = stripCountryCode(cleaned, selectedCountry.dialCode);

    setInputValue(phoneWithoutCode);

    // Format final value
    const finalValue = formatPhoneValue(selectedCountry.dialCode, phoneWithoutCode);

    if (onChange) {
      onChange({
        target: {
          value: finalValue,
          name: name,
        },
      });
    }
  };

  // Initialize input value from external value prop
  useEffect(() => {
    if (value) {
      const matchingCountry = findCountryFromPhoneNumber(value);
      if (matchingCountry) {
        setSelectedCountry(matchingCountry);
        const phoneWithoutCode = stripCountryCode(value, matchingCountry.dialCode);
        setInputValue(phoneWithoutCode);
      } else {
        // If no country code found, assume default country and strip it if present
        const phoneWithoutCode = stripCountryCode(value, DEFAULT_COUNTRY.dialCode);
        setInputValue(phoneWithoutCode);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <div className="relative flex items-center rounded-sm border border-foreground/20 shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] overflow-hidden">
        <Select
          value={selectedCountry.code}
          onValueChange={handleCountryChange}
          disabled={disabled}>
          <SelectTrigger
            className="w-fit shrink-0 border-0 shadow-none rounded-none bg-muted/50 hover:bg-muted/70 focus:ring-0 focus-visible:ring-0 px-3 py-3"
            size="default">
            <SelectValue>
              <span className="flex items-center gap-2">
                <img
                  src={selectedCountry.flag}
                  alt={`${selectedCountry.name} flag`}
                  loading="lazy"
                  width={24}
                  height={18}
                  className="h-4 w-6 rounded-[2px] object-cover shadow-sm"
                />
                <span>{selectedCountry.dialCode}</span>
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(country => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    loading="lazy"
                    width={24}
                    height={18}
                    className="h-4 w-6 rounded-[2px] object-cover shadow-sm"
                  />
                  <span className="font-medium">{country.dialCode}</span>
                  <span className="text-muted-foreground">{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="h-6 w-px bg-foreground/20" />
        <Input
          placeholder={placeholder}
          type="tel"
          className={cn('flex-1 border-0 shadow-none rounded-none focus-visible:ring-0', className)}
          ref={localRef}
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          name={name}
          {...props}
          onFocus={(e: FocusEvent<HTMLInputElement>) => {
            if (onFocus) onFocus(e);
          }}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            if (onBlur) onBlur(e);
          }}
        />
      </div>
    </InputWrapper>
  );
};
