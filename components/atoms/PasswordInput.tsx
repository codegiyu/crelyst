'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

import { RegularInput, type RegularInputProps } from './RegularInput';

export interface PasswordInputProps extends Omit<RegularInputProps, 'type'> {
  showVisibilityToggle?: boolean;
  defaultVisible?: boolean;
}

export const PasswordInput = ({
  showVisibilityToggle = true,
  defaultVisible = false,
  className,
  ...props
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  const visibilityButton = showVisibilityToggle ? (
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-dark/60 transition hover:text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
      aria-label={isVisible ? 'Hide password' : 'Show password'}
      aria-pressed={isVisible}>
      {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  ) : null;

  return (
    <RegularInput
      {...props}
      type={isVisible ? 'text' : 'password'}
      className={cn(showVisibilityToggle ? 'pr-11' : '', className)}
      endAdornment={visibilityButton}
    />
  );
};
