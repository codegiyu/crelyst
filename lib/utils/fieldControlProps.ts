import type { FieldControlContextValue } from '@/components/general/InputWrapper';

/** Shared aria / invalid props for form controls inside InputWrapper */
export function getFieldControlAriaProps(
  field: FieldControlContextValue | null,
  errors?: string[]
) {
  const hasError = (errors?.length ?? 0) > 0 || field?.hasError;
  if (!field) {
    return {
      'aria-invalid': hasError ? (true as const) : undefined,
    };
  }
  return {
    id: field.controlId,
    'aria-invalid': hasError ? (true as const) : undefined,
    'aria-describedby': hasError ? field.errorId : undefined,
  };
}

export function getFieldErrorClass(hasError: boolean) {
  return hasError ? 'border-destructive focus-visible:ring-destructive/30' : '';
}
