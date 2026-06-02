import { sendResponse } from '../../lib/utils/appResponse';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import {
  assertPublicFormRateLimit,
  getClientIpForRateLimit,
} from '../../lib/utils/publicFormRateLimit';
import { presignFormAttachmentsBodySchema } from '../../lib/validation/formAttachments';
import { generatePresignedUrl, getContentTypeFromExtension } from '../../lib/utils/r2';
import {
  getExtensionFromFileName,
  validateFormAttachmentFile,
} from '@/lib/constants/formAttachments';
import { AppError } from '../../lib/utils/appError';

export const presignFormSubmissionAttachments: RouteHandler = async ({ body, request }) => {
  const ip = getClientIpForRateLimit(request);
  assertPublicFormRateLimit(ip, 'form-attachments-presign');

  const payload = validateBody(presignFormAttachmentsBodySchema, body ?? {});

  const uploads = await Promise.all(
    payload.files.map(async fileMeta => {
      const validationError = validateFormAttachmentFile(
        fileMeta.fileName,
        fileMeta.fileSize,
        fileMeta.contentType
      );
      if (validationError) {
        throw new AppError(validationError, 400);
      }

      const extension = getExtensionFromFileName(fileMeta.fileName);
      const contentType = fileMeta.contentType.trim() || getContentTypeFromExtension(extension);

      const { url, key, publicUrl, filename } = await generatePresignedUrl({
        entityType: 'form-submission',
        entityId: payload.uploadSessionId,
        intent: 'attachment',
        fileExtension: extension,
        contentType,
        expiresIn: 3600,
      });

      return {
        uploadUrl: url,
        key,
        publicUrl,
        fileName: fileMeta.fileName,
        storedFileName: filename,
      };
    })
  );

  return sendResponse(
    200,
    { uploads, uploadSessionId: payload.uploadSessionId },
    'Presigned URLs generated'
  );
};
