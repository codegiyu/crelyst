import type { FormSubmissionAttachment } from '@/lib/constants/formAttachments';

export function attachmentFieldsForEmail(
  attachments: FormSubmissionAttachment[] | undefined
): Record<string, string> {
  if (!attachments?.length) return {};
  const links = attachments.map((a, i) => `${i + 1}. ${a.fileName}: ${a.publicUrl}`).join('\n');
  return { Attachments: links };
}
