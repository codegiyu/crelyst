import { z } from 'zod';

export const listLimitSchema = z.coerce.number().int().min(1).max(100).default(25);

export const optionalCursorSchema = z
  .string()
  .trim()
  .min(1)
  .max(512)
  .optional()
  .nullable()
  .transform(v => v ?? null);

export const formSubmissionsListQuerySchema = z.object({
  formType: z.enum(['quote-request', 'work-with-us']),
  limit: listLimitSchema,
  cursor: optionalCursorSchema,
});

export const auditLogsListQuerySchema = z.object({
  limit: listLimitSchema.default(50),
  cursor: optionalCursorSchema,
  q: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform(v => (v && v.length > 0 ? v : undefined)),
});

export type FormSubmissionsListQuery = z.infer<typeof formSubmissionsListQuerySchema>;
export type AuditLogsListQuery = z.infer<typeof auditLogsListQuerySchema>;
