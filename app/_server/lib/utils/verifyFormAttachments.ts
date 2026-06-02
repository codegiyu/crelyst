import { AppError } from './appError';
import {
  assertAttachmentKeyMatchesSession,
  type FormSubmissionAttachment,
} from '@/lib/constants/formAttachments';
import { objectExistsInR2 } from './r2';

export async function verifyFormAttachmentsForSubmit(
  uploadSessionId: string | undefined,
  attachments: FormSubmissionAttachment[] | undefined
): Promise<FormSubmissionAttachment[] | undefined> {
  if (!attachments?.length) {
    return undefined;
  }

  if (!uploadSessionId) {
    throw new AppError('uploadSessionId is required when attachments are provided', 400);
  }

  for (const attachment of attachments) {
    if (!assertAttachmentKeyMatchesSession(attachment.key, uploadSessionId)) {
      throw new AppError('Invalid attachment key for this upload session', 400);
    }
    const exists = await objectExistsInR2(attachment.key);
    if (!exists) {
      throw new AppError(`Attachment not found: ${attachment.fileName}`, 400);
    }
  }

  return attachments;
}
