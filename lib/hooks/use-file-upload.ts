'use client';

import { useState } from 'react';
import { callApi } from '../services/callApi';
import { uploadFileWithProgress } from '../utils/general';
import type { EntityType, UploadIntent } from '@/app/_server/lib/types/constants';
import { toast } from 'sonner';

interface UseFileUploadOptions {
  entityType: EntityType;
  entityId: string;
  intent: UploadIntent;
  onUploadComplete?: (
    url: string,
    context?: { key?: string; fileName?: string; fileSize?: number; intent?: string }
  ) => Promise<void> | void;
}

export type UploadResult = {
  url: string;
  key?: string;
  fileName?: string;
  fileSize?: number;
  intent?: string;
};

export type PendingUpload = {
  file: File;
  previewUrl: string;
  intent: UploadIntent;
};

/**
 * Hook for handling file uploads with presigned URLs
 * Supports immediate upload or deferred upload (for entity creation flows)
 */
export const useFileUpload = ({
  entityType,
  entityId,
  intent,
  onUploadComplete,
}: UseFileUploadOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  /**
   * Extracts file extension from filename
   */
  const getFileExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    if (lastDot === -1 || lastDot === filename.length - 1) {
      return '';
    }
    return filename.substring(lastDot + 1).toLowerCase();
  };

  /**
   * Handle file selection - creates preview but doesn't upload
   */
  const handleFileSelect = (selectedFile: File | null) => {
    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selectedFile) {
      setFile(selectedFile);
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
      setUploadedUrl(null); // Clear any previous upload
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  /**
   * Handle file input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  /**
   * Upload the selected file
   * Can be called with a different entityId for deferred uploads
   */
  const uploadFile = async (options?: {
    file?: File;
    entityId?: string;
    intent?: UploadIntent;
  }): Promise<UploadResult | null> => {
    const fileToUpload = options?.file || file;
    const targetEntityId = options?.entityId || entityId;
    const targetIntent = options?.intent || intent;

    if (!fileToUpload) {
      toast.error('Please select a file first');
      return null;
    }

    if (!targetEntityId) {
      toast.error('Missing entity ID for upload');
      return null;
    }

    setLoading(true);
    setProgress(0);

    const fileExtension = getFileExtension(fileToUpload.name);
    const contentType = fileToUpload.type || 'application/octet-stream';

    const { data, error } = await callApi('ADMIN_GENERATE_PRESIGNED_URL', {
      payload: {
        entityType,
        entityId: targetEntityId,
        intent: targetIntent,
        fileExtension,
        contentType,
      },
    });

    if (error || !data) {
      setLoading(false);
      setProgress(0);
      toast.error(error?.message || 'Failed to get upload URL');
      return null;
    }

    // Handle single file response
    if ('uploadUrl' in data && data.uploadUrl && 'publicUrl' in data && data.publicUrl) {
      const { uploadUrl, publicUrl, key, intent: responseIntent } = data;

      try {
        await uploadFileWithProgress(fileToUpload, uploadUrl, (progressPercentage: number) => {
          console.log({ progressPercentage });
          setProgress(progressPercentage);
        });
      } catch {
        setLoading(false);
        setProgress(0);
        toast.error('Failed to upload file. Please try again');
        return null;
      }

      setUploadedUrl(publicUrl);
      setLoading(false);
      setProgress(100);

      const result: UploadResult = {
        url: publicUrl,
        key: key || undefined,
        fileName: fileToUpload.name,
        fileSize: fileToUpload.size,
        intent: responseIntent || targetIntent,
      };

      // Call completion handler if provided
      if (onUploadComplete) {
        await onUploadComplete(publicUrl, {
          key: key || undefined,
          fileName: fileToUpload.name,
          fileSize: fileToUpload.size,
          intent: responseIntent || targetIntent,
        });
      }

      return result;
    }

    setLoading(false);
    setProgress(0);
    toast.error('Invalid response from server');
    return null;
  };

  /**
   * Clear the current file and preview
   */
  const clearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setProgress(0);
  };

  /**
   * Get pending upload data for deferred uploads
   */
  const getPendingUpload = (): PendingUpload | null => {
    if (!file || !previewUrl) return null;
    return {
      file,
      previewUrl,
      intent,
    };
  };

  return {
    // State
    file,
    previewUrl,
    loading,
    progress,
    uploadedUrl,
    hasFile: !!file,
    hasPendingUpload: !!file && !uploadedUrl,

    // Actions
    handleFileChange,
    handleFileSelect,
    uploadFile,
    clearFile,
    getPendingUpload,
    setFile,
  };
};

/**
 * Hook for managing multiple pending uploads (for entity creation)
 * Files are stored locally until the entity is created, then uploaded
 */
export const usePendingUploads = () => {
  const [pendingUploads, setPendingUploads] = useState<Map<string, PendingUpload>>(new Map());

  const addPendingUpload = (key: string, upload: PendingUpload) => {
    setPendingUploads(prev => new Map(prev).set(key, upload));
  };

  const removePendingUpload = (key: string) => {
    setPendingUploads(prev => {
      const newMap = new Map(prev);
      const upload = newMap.get(key);
      if (upload?.previewUrl) {
        URL.revokeObjectURL(upload.previewUrl);
      }
      newMap.delete(key);
      return newMap;
    });
  };

  const clearAllPendingUploads = () => {
    pendingUploads.forEach(upload => {
      if (upload.previewUrl) {
        URL.revokeObjectURL(upload.previewUrl);
      }
    });
    setPendingUploads(new Map());
  };

  const getPendingUpload = (key: string) => {
    return pendingUploads.get(key) || null;
  };

  const hasPendingUploads = pendingUploads.size > 0;

  return {
    pendingUploads,
    addPendingUpload,
    removePendingUpload,
    clearAllPendingUploads,
    getPendingUpload,
    hasPendingUploads,
  };
};
