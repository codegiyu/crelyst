import type { ClientFormSubmissionAttachment } from '@/lib/constants/endpoints';
import { formatFileSize } from '@/lib/utils/general';
import { ExternalLink, Paperclip } from 'lucide-react';

export function FormSubmissionAttachmentsList({
  attachments,
}: {
  attachments?: ClientFormSubmissionAttachment[];
}) {
  if (!attachments?.length) {
    return <p className="text-sm text-muted-foreground italic">No files attached</p>;
  }

  return (
    <ul className="space-y-2">
      {attachments.map((file, index) => {
        const size = formatFileSize(file.fileSize);
        return (
          <li
            key={`${file.key}-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
            <div className="flex min-w-0 items-start gap-2">
              <Paperclip className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{file.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {size.filesize} {size.unit}
                  {file.contentType ? ` · ${file.contentType}` : ''}
                </p>
              </div>
            </div>
            <a
              href={file.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-primary hover:underline text-xs font-medium">
              Open
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
