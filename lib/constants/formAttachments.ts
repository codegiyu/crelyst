export const FORM_ATTACHMENT_MAX_COUNT = 3;
export const FORM_ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

export const FORM_ATTACHMENT_ALLOWED_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'png',
  'jpg',
  'jpeg',
  'webp',
] as const;

export type FormAttachmentAllowedExtension = (typeof FORM_ATTACHMENT_ALLOWED_EXTENSIONS)[number];

export type FormSubmissionAttachment = {
  fileName: string;
  fileSize: number;
  contentType: string;
  key: string;
  publicUrl: string;
};

const EXTENSION_TO_MIME: Record<FormAttachmentAllowedExtension, string[]> = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  png: ['image/png'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  webp: ['image/webp'],
};

export function getExtensionFromFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  if (lastDot === -1 || lastDot === fileName.length - 1) return '';
  return fileName.slice(lastDot + 1).toLowerCase();
}

export function isAllowedFormAttachmentExtension(
  ext: string
): ext is FormAttachmentAllowedExtension {
  return (FORM_ATTACHMENT_ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function validateFormAttachmentFile(
  fileName: string,
  fileSize: number,
  contentType: string
) {
  const ext = getExtensionFromFileName(fileName);
  if (!isAllowedFormAttachmentExtension(ext)) {
    return `File type not allowed: ${fileName}. Use PDF, Word, PNG, JPG, or WebP.`;
  }
  if (fileSize > FORM_ATTACHMENT_MAX_BYTES) {
    return `File too large: ${fileName}. Maximum size is 5MB per file.`;
  }
  if (fileSize <= 0) {
    return `Invalid file: ${fileName}.`;
  }
  const allowedMimes = EXTENSION_TO_MIME[ext];
  const normalizedType = contentType.split(';')[0]?.trim().toLowerCase() ?? '';
  if (normalizedType && !allowedMimes.includes(normalizedType)) {
    return `File content type does not match extension for ${fileName}.`;
  }
  return null;
}

export function buildFormAttachmentKeyPrefix(uploadSessionId: string): string {
  return `form-submission/${uploadSessionId}/attachment/`;
}

export function assertAttachmentKeyMatchesSession(key: string, uploadSessionId: string): boolean {
  return key.includes(`/form-submission/${uploadSessionId}/attachment/`);
}

export const FORM_ATTACHMENT_ACCEPT = FORM_ATTACHMENT_ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(
  ','
);
