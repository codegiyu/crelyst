import { z } from 'zod';
import {
  FORM_ATTACHMENT_MAX_BYTES,
  FORM_ATTACHMENT_MAX_COUNT,
  validateFormAttachmentFile,
} from '@/lib/constants/formAttachments';

export const formAttachmentMetaSchema = z
  .object({
    fileName: z.string().min(1),
    fileSize: z.number().int().positive().max(FORM_ATTACHMENT_MAX_BYTES),
    contentType: z.string().min(1),
    key: z.string().min(1),
    publicUrl: z.url(),
  })
  .superRefine((data, ctx) => {
    const message = validateFormAttachmentFile(data.fileName, data.fileSize, data.contentType);
    if (message) {
      ctx.addIssue({ code: 'custom', message });
    }
  });

export const formAttachmentsPayloadSchema = z.object({
  uploadSessionId: z.uuid().optional(),
  attachments: z.array(formAttachmentMetaSchema).max(FORM_ATTACHMENT_MAX_COUNT).optional(),
});

export const presignFormAttachmentsBodySchema = z.object({
  formType: z.enum(['quote-request', 'work-with-us']),
  uploadSessionId: z.uuid(),
  files: z
    .array(
      z.object({
        fileName: z.string().min(1),
        fileSize: z.number().int().positive().max(FORM_ATTACHMENT_MAX_BYTES),
        contentType: z.string().min(1),
      })
    )
    .min(1)
    .max(FORM_ATTACHMENT_MAX_COUNT),
});

export type PresignFormAttachmentsBody = z.infer<typeof presignFormAttachmentsBodySchema>;
