'use client';

import { useId, useRef } from 'react';
import { Paperclip, X } from 'lucide-react';
import { InputWrapper } from '@/components/general/InputWrapper';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { cn } from '@/lib/utils';
import { FORM_ATTACHMENT_ACCEPT, FORM_ATTACHMENT_MAX_COUNT } from '@/lib/constants/formAttachments';
import { formatFileSize } from '@/lib/utils/general';
import type { PublicFormAttachmentFile } from '@/lib/hooks/use-public-form-attachments';

export type RegularFileInputProps = {
  label?: string;
  subtext?: string;
  required?: boolean;
  files: PublicFormAttachmentFile[];
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  errors?: string[];
  disabled?: boolean;
  wrapClassName?: string;
};

export function RegularFileInput({
  label = 'Attachments',
  subtext = `Optional · up to ${FORM_ATTACHMENT_MAX_COUNT} files · 5MB each · PDF, Word, PNG, JPG, WebP`,
  required,
  files,
  onFilesSelected,
  onRemoveFile,
  errors = [],
  disabled,
  wrapClassName,
}: RegularFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const hasError = errors.length > 0 || false;
  const allErrors = errors;

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      required={required}
      errors={allErrors}
      fieldId={inputId}>
      <div className="space-y-3">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={FORM_ATTACHMENT_ACCEPT}
          className="sr-only"
          disabled={disabled || files.length >= FORM_ATTACHMENT_MAX_COUNT}
          onChange={e => {
            if (e.target.files?.length) {
              onFilesSelected(e.target.files);
              e.target.value = '';
            }
          }}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
        />
        <RegularBtn
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={disabled || files.length >= FORM_ATTACHMENT_MAX_COUNT}
          LeftIcon={Paperclip}
          leftIconProps={{ className: 'size-4' }}
          text={
            files.length >= FORM_ATTACHMENT_MAX_COUNT ? 'Maximum files selected' : 'Choose files'
          }
          onClick={() => inputRef.current?.click()}
        />

        {files.length > 0 ? (
          <ul className="space-y-2" aria-live="polite">
            {files.map(({ id, file }) => (
              <li
                key={id}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm'
                )}>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size).filesize} {formatFileSize(file.size).unit}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${file.name}`}
                  disabled={disabled}
                  onClick={() => onRemoveFile(id)}>
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </InputWrapper>
  );
}
