import { RequestFormProps, StringOrStringArraySchema } from '@/components/forms/FormTemplate';
import { z } from 'zod';
import { default as pick } from 'lodash/pick';
import { generateOptionsFromArray } from '../utils/general';

type FormSchemaField =
  | 'fullName'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phoneNumber'
  | 'message'
  | 'inquiryType';

export const ALL_FIELDS_SCHEMA: Record<FormSchemaField, StringOrStringArraySchema> = {
  fullName: z.string().min(3, { error: 'Please enter at least 3 characters' }),
  firstName: z.string({ error: 'Please enter your first name' }),
  lastName: z.string({ error: 'Please enter your last name' }),
  email: z.email({ error: 'Please enter a valid email' }),
  phoneNumber: z
    .string()
    .min(11, { error: 'Please enter at least 11 characters' })
    .max(14, { error: 'Phone number is too long' }),
  inquiryType: z.string().min(1, { error: '' }),
  message: z.string().min(10, { error: 'Message is not long enough' }),
};

export const ALL_FIELDS_DEFAULT: Record<FormSchemaField, string | string[]> = {
  fullName: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  inquiryType: '',
  message: '',
};

export const contactFormSchema = z.object({
  fullName: ALL_FIELDS_SCHEMA.fullName,
  email: ALL_FIELDS_SCHEMA.email,
  phoneNumber: ALL_FIELDS_SCHEMA.phoneNumber,
  inquiryType: ALL_FIELDS_SCHEMA.inquiryType,
  message: ALL_FIELDS_SCHEMA.message,
});

export const contactFormData: RequestFormProps<typeof contactFormSchema> = {
  formId: 'contact-form',
  formName: 'Contact',
  formTitle: 'Send Us a Message',
  btnText: 'Send Message',
  formSchema: contactFormSchema,
  defaultFormValues: pick(ALL_FIELDS_DEFAULT, [
    'fullName',
    'email',
    'phoneNumber',
    'inquiryType',
    'message',
  ]),
  inputsArr: [
    [
      {
        name: 'fullName',
        kind: 'input',
        inputProps: {
          label: 'Full Name',
          placeholder: 'John Doe',
          required: true,
        },
      },
      {
        name: 'email',
        kind: 'input',
        inputProps: {
          label: 'Email Address',
          placeholder: 'john@example.com',
          required: true,
        },
      },
    ],
    [
      {
        name: 'phoneNumber',
        kind: 'input',
        inputProps: {
          type: 'tel',
          label: 'Phone Number',
          placeholder: 'eg. 08123456789',
          required: true,
        },
      },
      {
        name: 'inquiryType',
        kind: 'select',
        selectProps: {
          label: 'Select Inquiry Type...',
          options: generateOptionsFromArray({
            arr: ['General Inquiry', 'Support Request', 'Collaboration', 'Other'],
          }),
          required: true,
        },
      },
    ],
    {
      name: 'message',
      kind: 'textarea',
      textareaProps: {
        label: 'Message',
        placeholder: 'Please provide details about your inquiry...',
        rows: 4,
        required: true,
      },
    },
  ],
};
