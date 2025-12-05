'use client';

import { ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { InputWrapper } from '../general/InputWrapper';
import { ImagePlus, X, Loader2, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';

export interface ImageUploadProps {
  label?: string;
  subtext?: ReactNode;
  labelClassName?: string;
  wrapClassName?: string;
  errors?: string[];
  required?: boolean;
  disabled?: boolean;

  // Image state
  value?: string; // Current image URL (from server or preview)
  previewUrl?: string; // Local preview URL for pending uploads

  // Callbacks
  onFileSelect?: (file: File | null) => void;
  onClear?: () => void;

  // Upload state (optional - for showing progress)
  uploading?: boolean;
  progress?: number;

  // Customization
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUpload = ({
  label,
  subtext,
  labelClassName,
  wrapClassName,
  errors = [],
  required = false,
  disabled = false,
  value,
  previewUrl,
  onFileSelect,
  onClear,
  uploading = false,
  progress = 0,
  accept = 'image/*',
  maxSizeMB = 5,
  aspectRatio = '16/9',
  placeholder = 'Click or drag to upload image',
  className,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Display URL is either the preview (local) or the actual value (server)
  const displayUrl = previewUrl || value;
  const hasImage = !!displayUrl;

  const handleClick = () => {
    if (!disabled && !uploading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      onFileSelect?.(file);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || uploading) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      onFileSelect?.(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    onFileSelect?.(null);
  };

  return (
    <InputWrapper
      wrapClassName={wrapClassName}
      label={label}
      subtext={subtext}
      labelTextClassName={labelClassName}
      required={required}
      errors={errors}>
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative w-full rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden',
          'hover:border-primary/50 hover:bg-primary/5',
          dragActive && 'border-primary bg-primary/10',
          hasImage && 'border-solid',
          disabled && 'opacity-50 cursor-not-allowed',
          uploading && 'cursor-wait',
          errors.length > 0 && 'border-destructive',
          className
        )}
        style={{ aspectRatio }}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        {hasImage ? (
          // Image preview
          <div className="relative w-full h-full">
            <Image
              src={displayUrl}
              alt="Upload preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay for uploading state */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-8 text-white animate-spin" />
                <span className="text-white text-sm font-medium">{progress}%</span>
              </div>
            )}

            {/* Clear button */}
            {!uploading && !disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-8 rounded-full shadow-md"
                onClick={handleClear}>
                <X className="size-4" />
              </Button>
            )}

            {/* Change image hint */}
            {!uploading && !disabled && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                  <Upload className="size-4" />
                  Change image
                </span>
              </div>
            )}
          </div>
        ) : (
          // Empty state / Upload prompt
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            {uploading ? (
              <>
                <Loader2 className="size-10 text-muted-foreground animate-spin" />
                <span className="text-sm text-muted-foreground">Uploading... {progress}%</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-10 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{placeholder}</span>
                <span className="text-xs text-muted-foreground/70">Max {maxSizeMB}MB</span>
              </>
            )}
          </div>
        )}
      </div>
    </InputWrapper>
  );
};
