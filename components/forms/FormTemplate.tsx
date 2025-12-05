/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
// This is a placeholder file showing the structure
// Import your form components and utilities here
// See lib/constants/forms.ts for form configuration examples

export type StringOrStringArraySchema = any; // Replace with actual zod types
export interface RequestFormProps<TSchema> {
  formId: string;
  formName: string;
  formTitle: string;
  btnText?: string;
  formSchema: TSchema;
  defaultFormValues: any;
  inputsArr: any[];
}
