import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Document } from '../../models/document';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { ENVIRONMENT } from '../../lib/config/environment';
import mongoose from 'mongoose';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Initialize S3 client for Cloudflare R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
    secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
  },
});

/**
 * Verify that a document was successfully uploaded to R2
 * This can be called via webhook or manually
 */
export const verifyDocumentUpload = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { body } = context as RequestContext;
    const { documentId, key } = body || {};

    if (!documentId && !key) {
      throw new AppError('Either documentId or key is required', 400);
    }

    let document;

    if (documentId) {
      if (!mongoose.Types.ObjectId.isValid(documentId)) {
        throw new AppError('Invalid documentId format', 400);
      }

      document = await Document.findById(documentId);

      if (!document) {
        throw new AppError('Document not found', 404);
      }
    } else {
      document = await Document.findOne({ key });

      if (!document) {
        throw new AppError('Document not found with the provided key', 404);
      }
    }

    if (document.status === 'verified') {
      return sendResponse(
        200,
        {
          document: {
            id: document._id,
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

    // Check if file exists in R2
    try {
      const command = new HeadObjectCommand({
        Bucket: ENVIRONMENT.R2.BUCKET_NAME,
        Key: document.key,
      });

      const headResult = await r2Client.send(command);

      // File exists, update document status
      const updateData: {
        status: 'uploaded' | 'verified';
        uploadedAt?: Date;
        verifiedAt?: Date;
        size?: number;
      } = {
        status: 'verified',
        verifiedAt: new Date(),
      };

      // If not already set, set uploadedAt
      if (!document.uploadedAt) {
        updateData.uploadedAt = new Date();
      }

      // Update size if available
      if (headResult.ContentLength !== undefined) {
        updateData.size = headResult.ContentLength;
      }

      await Document.findByIdAndUpdate(document._id, updateData);

      // Fetch updated document
      const updatedDocument = await Document.findById(document._id);

      return sendResponse(
        200,
        {
          document: {
            id: updatedDocument!._id,
            status: updatedDocument!.status,
            key: updatedDocument!.key,
            publicUrl: updatedDocument!.publicUrl,
            size: updatedDocument!.size,
            uploadedAt: updatedDocument!.uploadedAt,
            verifiedAt: updatedDocument!.verifiedAt,
          },
        },
        'Document upload verified successfully'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // If file doesn't exist (404) or other error
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        // Update status to failed if still pending
        if (document.status === 'pending') {
          await Document.findByIdAndUpdate(document._id, {
            status: 'failed',
            errorMessage: 'File not found in storage',
          });
        }

        throw new AppError('File not found in storage. Upload may not have completed.', 404);
      }

      // Other errors
      throw new AppError(`Error verifying upload: ${error.message}`, 500);
    }
  })
);
