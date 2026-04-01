import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import {
  getDocumentById,
  getDocumentByKey,
  updateDocumentById,
} from '../../lib/firestore/collections';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { ENVIRONMENT } from '../../lib/config/environment';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { assertWebhookSecretConfigured } from '../../lib/utils/verifyWebhookSecret';

const verifyDocumentUploadBodySchema = z
  .object({
    documentId: z.string().trim().optional(),
    key: z.string().trim().optional(),
  })
  .refine(
    data =>
      (data.documentId !== undefined && data.documentId.length > 0) ||
      (data.key !== undefined && data.key.length > 0),
    { message: 'Either documentId or key is required' }
  );

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
    secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
  },
});

export const verifyDocumentUpload: RouteHandler = async ({ body, request }) => {
  assertWebhookSecretConfigured(request);
  const payload = validateBody(verifyDocumentUploadBodySchema, body ?? {});

  const { documentId, key } = payload;

  type DocRecord = {
    id: string;
    status: string;
    key: string;
    publicUrl: string;
    uploadedAt?: Date;
    verifiedAt?: Date;
  };
  let document: DocRecord | null = null;

  if (documentId && documentId.trim().length > 0) {
    document = (await getDocumentById(documentId)) as DocRecord | null;
  } else if (key && key.trim().length > 0) {
    document = (await getDocumentByKey(key)) as DocRecord | null;
  }

  if (!document) {
    throw new AppError(
      documentId ? 'Document not found' : 'Document not found with the provided key',
      404
    );
  }

  if (document.status === 'verified') {
    return sendResponse(
      200,
      {
        document: {
          id: document.id,
          status: document.status,
          key: document.key,
          publicUrl: document.publicUrl,
          verifiedAt: document.verifiedAt,
        },
      },
      'Document already verified'
    );
  }

  if (document.status === 'expired') {
    throw new AppError('Document upload URL has expired', 410);
  }

  try {
    const command = new HeadObjectCommand({
      Bucket: ENVIRONMENT.R2.BUCKET_NAME,
      Key: document.key,
    });

    const headResult = await r2Client.send(command);

    const updateData: Record<string, unknown> = {
      status: 'verified',
      verifiedAt: new Date(),
    };

    if (!document.uploadedAt) {
      updateData.uploadedAt = new Date();
    }

    if (headResult.ContentLength !== undefined) {
      updateData.size = headResult.ContentLength;
    }

    await updateDocumentById(document.id, updateData);

    const updatedDoc = (await getDocumentById(document.id)) as DocRecord & Record<string, unknown>;

    return sendResponse(
      200,
      {
        document: {
          id: updatedDoc?.id,
          status: updatedDoc?.status,
          key: updatedDoc?.key,
          publicUrl: updatedDoc?.publicUrl,
          size: updatedDoc?.size,
          uploadedAt: updatedDoc?.uploadedAt,
          verifiedAt: updatedDoc?.verifiedAt,
        },
      },
      'Document upload verified successfully'
    );
  } catch (error: unknown) {
    const err = error as {
      name?: string;
      $metadata?: { httpStatusCode?: number };
      message?: string;
    };
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      if (document.status === 'pending') {
        await updateDocumentById(document.id, {
          status: 'failed',
          errorMessage: 'File not found in storage',
        });
      }

      throw new AppError('File not found in storage. Upload may not have completed.', 404);
    }

    throw new AppError(`Error verifying upload: ${err.message || 'Unknown error'}`, 500);
  }
};
