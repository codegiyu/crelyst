'use client';

import { useCallback, useMemo, useState } from 'react';
import { callApi } from '@/lib/services/callApi';
import { uploadFileWithProgress } from '@/lib/utils/general';
import {
  FORM_ATTACHMENT_MAX_COUNT,
  type FormSubmissionAttachment,
  validateFormAttachmentFile,
} from '@/lib/constants/formAttachments';
import type { FormSubmissionFormType } from '@/lib/constants/endpoints';

export type PublicFormAttachmentFile = {
  id: string;
  file: File;
};

function newFileId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function usePublicFormAttachments(formType: FormSubmissionFormType) {
  const [uploadSessionId] = useState(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `session-${Date.now()}`
  );
  const [files, setFiles] = useState<PublicFormAttachmentFile[]>([]);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    setFieldError(null);

    setFiles(prev => {
      const next = [...prev];
      for (const file of list) {
        if (next.length >= FORM_ATTACHMENT_MAX_COUNT) {
          setFieldError(`You can attach up to ${FORM_ATTACHMENT_MAX_COUNT} files.`);
          break;
        }
        const validationError = validateFormAttachmentFile(file.name, file.size, file.type);
        if (validationError) {
          setFieldError(validationError);
          continue;
        }
        if (next.some(entry => entry.file.name === file.name && entry.file.size === file.size)) {
          continue;
        }
        next.push({ id: newFileId(), file });
      }
      return next;
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setFieldError(null);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setFieldError(null);
  }, []);

  const uploadAttachments = useCallback(async (): Promise<
    FormSubmissionAttachment[] | undefined
  > => {
    if (files.length === 0) return undefined;

    setUploading(true);
    setFieldError(null);

    try {
      const { data, error } = await callApi('PRESIGN_FORM_SUBMISSION_ATTACHMENTS', {
        payload: {
          formType,
          uploadSessionId,
          files: files.map(({ file }) => ({
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type || 'application/octet-stream',
          })),
        },
      });

      if (error || !data?.uploads?.length) {
        setFieldError(error?.message || 'Could not prepare file upload. Please try again.');
        return undefined;
      }

      const uploaded: FormSubmissionAttachment[] = [];

      for (let i = 0; i < data.uploads.length; i++) {
        const presigned = data.uploads[i];
        const file = files[i]?.file;
        if (!file) continue;

        await uploadFileWithProgress(file, presigned.uploadUrl, () => {});

        uploaded.push({
          fileName: presigned.fileName,
          fileSize: file.size,
          contentType: file.type || 'application/octet-stream',
          key: presigned.key,
          publicUrl: presigned.publicUrl,
        });
      }

      return uploaded;
    } catch {
      setFieldError('File upload failed. Please try again.');
      return undefined;
    } finally {
      setUploading(false);
    }
  }, [files, formType, uploadSessionId]);

  return useMemo(
    () => ({
      uploadSessionId,
      files,
      fieldError,
      uploading,
      addFiles,
      removeFile,
      clearFiles,
      uploadAttachments,
      setFieldError,
    }),
    [
      uploadSessionId,
      files,
      fieldError,
      uploading,
      addFiles,
      removeFile,
      clearFiles,
      uploadAttachments,
    ]
  );
}
