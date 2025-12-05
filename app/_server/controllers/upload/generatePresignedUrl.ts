import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { generatePresignedUrl, getContentTypeFromExtension } from '../../lib/utils/r2';
import type { EntityType, UploadIntent } from '../../lib/types/constants';
import { ACCESS_TYPES } from '../../lib/types/constants';
import { Document } from '../../models/document';
import { User } from '../../models/user';
import { Admin } from '../../models/admin';
import { Service } from '../../models/service';
import { Project } from '../../models/project';
import { Testimonial } from '../../models/testimonial';
import { Brand } from '../../models/brand';
import mongoose from 'mongoose';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

type FileDescriptorInput = {
  fileExtension: string;
  contentType: string;
};

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const resolveContentType = (fileExtension: string, contentType: string, intent: UploadIntent) => {
  const extension = normalizeString(fileExtension) ?? '';
  let resolvedContentType = normalizeString(contentType);

  // If no contentType provided, try to infer from extension
  if (!resolvedContentType && extension) {
    resolvedContentType = getContentTypeFromExtension(extension);
  }

  // If still no contentType, use defaults based on intent
  if (!resolvedContentType) {
    if (
      intent === 'avatar' ||
      intent === 'logo' ||
      intent === 'card-image' ||
      intent === 'banner-image' ||
      intent === 'image' ||
      intent === 'other'
    ) {
      resolvedContentType = 'image/jpeg';
    } else {
      resolvedContentType = 'application/octet-stream';
    }
  }

  return {
    extension,
    contentType: resolvedContentType,
  };
};

export const generatePresignedUrlController = (accessType: ACCESS_TYPES) =>
  withRequestContext({ accessType, protect: accessType === 'console' })(
    catchAsync(async context => {
      const { body, user } = context as RequestContext;
      const {
        entityType,
        entityId,
        intent,
        fileExtension,
        contentType,
        files: filesPayload,
      } = body || {};

      const filesArray = Array.isArray(filesPayload) ? filesPayload : [];

      // Validate required fields
      if (!entityType) {
        throw new AppError('entityType is required', 400);
      }

      if (!entityId) {
        throw new AppError('entityId is required', 400);
      }

      if (!intent) {
        throw new AppError('intent is required', 400);
      }

      // Validate that either (fileExtension + contentType) OR files array is provided
      const hasSingleFile = fileExtension !== undefined && contentType !== undefined;
      const hasFilesArray = filesArray.length > 0;

      if (!hasSingleFile && !hasFilesArray) {
        throw new AppError(
          'Either provide fileExtension and contentType, or provide a files array with fileExtension and contentType for each file',
          400
        );
      }

      if (hasSingleFile && hasFilesArray) {
        throw new AppError(
          'Cannot provide both fileExtension/contentType and files array. Use one or the other.',
          400
        );
      }

      // Validate entityType
      const validEntityTypes: EntityType[] = [
        'user',
        'admin',
        'service',
        'project',
        'testimonial',
        'brand',
      ];
      if (!validEntityTypes.includes(entityType)) {
        throw new AppError(
          `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}`,
          400
        );
      }

      // Validate intent
      const validIntents: UploadIntent[] = [
        'avatar',
        'logo',
        'card-image',
        'banner-image',
        'image',
        'other',
      ];

      const ALLOWED_USER_INTENTS: UploadIntent[] = ['avatar', 'other'];
      const isUserAccess = accessType === 'client';

      const validateIntent = (value: UploadIntent, _label: string) => {
        if (!validIntents.includes(value)) {
          throw new AppError(
            `Invalid intent "${value}". Must be one of: ${validIntents.join(', ')}`,
            400
          );
        }
        if (isUserAccess && !ALLOWED_USER_INTENTS.includes(value)) {
          throw new AppError('Users can only upload avatar or other images', 403);
        }
        return value;
      };

      const resolvedIntent = validateIntent(intent, 'intent');

      // Validate entityId format
      if (!mongoose.Types.ObjectId.isValid(entityId)) {
        throw new AppError('Invalid entityId format', 400);
      }

      // Determine targetEntityId based on access type and entity type
      let targetEntityId: string = '';

      if (isUserAccess) {
        // For customer access, validate permissions
        if (!user || !user._id) {
          throw new AppError('IVT: Unauthenticated', 400);
        }

        const userId = user._id.toString();

        if (entityType !== 'user') {
          throw new AppError('Users can only upload files for their own account', 403);
        }

        if (entityId !== userId) {
          throw new AppError('Users can only upload files for their own account', 403);
        }

        targetEntityId = userId;
      } else {
        // For admin access, validate entityType and entityId
        // Validate entityType is valid
        if (!validEntityTypes.includes(entityType)) {
          throw new AppError(
            `Invalid entityType. Must be one of: ${validEntityTypes.join(', ')}`,
            400
          );
        }

        // Validate entityId format
        if (!mongoose.Types.ObjectId.isValid(entityId)) {
          throw new AppError('Invalid entityId format', 400);
        }

        // Validate entity exists in database based on entityType
        targetEntityId = entityId;

        if (entityType === 'user') {
          const exists = await User.exists({
            _id: entityId,
            isDeleted: { $ne: true },
          });
          if (!exists) {
            throw new AppError('User not found or has been deleted', 404);
          }
        } else if (entityType === 'admin') {
          const exists = await Admin.exists({
            _id: entityId,
          });
          if (!exists) {
            throw new AppError('Admin not found', 404);
          }
        } else if (entityType === 'service') {
          const exists = await Service.exists({
            _id: entityId,
          });
          if (!exists) {
            throw new AppError('Service not found', 404);
          }
        } else if (entityType === 'project') {
          const exists = await Project.exists({
            _id: entityId,
          });
          if (!exists) {
            throw new AppError('Project not found', 404);
          }
        } else if (entityType === 'testimonial') {
          const exists = await Testimonial.exists({
            _id: entityId,
          });
          if (!exists) {
            throw new AppError('Testimonial not found', 404);
          }
        } else if (entityType === 'brand') {
          const exists = await Brand.exists({
            _id: entityId,
          });
          if (!exists) {
            throw new AppError('Brand not found', 404);
          }
        }
      }

      if (filesArray.length > 0) {
        // Batch mode: process files array
        if (filesArray.length > 20) {
          throw new AppError('You can only generate up to 20 presigned URLs per request', 400);
        }

        const uploads = await Promise.all(
          filesArray.map(async (entryRaw: unknown, index) => {
            if (!entryRaw || typeof entryRaw !== 'object') {
              throw new AppError(`files[${index}] must be an object`, 400);
            }

            const entry = entryRaw as FileDescriptorInput;

            if (!entry.fileExtension) {
              throw new AppError(`files[${index}].fileExtension is required`, 400);
            }

            if (!entry.contentType) {
              throw new AppError(`files[${index}].contentType is required`, 400);
            }

            const { extension, contentType: resolvedContentType } = resolveContentType(
              entry.fileExtension,
              entry.contentType,
              resolvedIntent
            );

            const { filename, url, key, publicUrl } = await generatePresignedUrl({
              entityType,
              entityId: targetEntityId,
              intent: resolvedIntent,
              fileExtension: extension,
              contentType: resolvedContentType,
              expiresIn: 3600,
            });

            // Save document record
            const uploadedBy = user;
            const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

            const document = await Document.create({
              entityType,
              entityId: new mongoose.Types.ObjectId(targetEntityId),
              intent: resolvedIntent,
              filename,
              key,
              publicUrl,
              uploadUrl: url,
              fileExtension: extension,
              contentType: resolvedContentType,
              status: 'pending',
              expiresAt,
              uploadedBy: uploadedBy?._id,
              uploadedByModel: accessType === 'client' ? 'Customer' : 'Admin',
            });

            return {
              id: document._id.toString(),
              intent: resolvedIntent,
              uploadUrl: url,
              key,
              filename,
              publicUrl,
              expiresIn: 3600,
              expiresAt: expiresAt.toISOString(),
            };
          })
        );

        return sendResponse(
          200,
          {
            uploads,
            count: uploads.length,
          },
          'Presigned URLs generated successfully'
        );
      }

      // Single file mode: use top-level fileExtension and contentType
      if (!fileExtension) {
        throw new AppError('fileExtension is required', 400);
      }

      if (!contentType) {
        throw new AppError('contentType is required', 400);
      }

      const { extension: singleExtension, contentType: singleContentType } = resolveContentType(
        fileExtension,
        contentType,
        resolvedIntent
      );

      const { filename, url, key, publicUrl } = await generatePresignedUrl({
        entityType,
        entityId: targetEntityId,
        intent: resolvedIntent,
        fileExtension: singleExtension,
        contentType: singleContentType,
        expiresIn: 3600, // 1 hour
      });

      // Save document record
      const uploadedBy = user;
      const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now

      const document = await Document.create({
        entityType,
        entityId: new mongoose.Types.ObjectId(targetEntityId),
        intent: resolvedIntent,
        filename,
        key,
        publicUrl,
        uploadUrl: url,
        fileExtension: singleExtension,
        contentType: singleContentType,
        status: 'pending',
        expiresAt,
        uploadedBy: uploadedBy?._id,
        uploadedByModel: accessType === 'client' ? 'Customer' : 'Admin',
      });

      return sendResponse(
        200,
        {
          id: document._id.toString(),
          uploadUrl: url,
          key,
          filename,
          intent: resolvedIntent,
          publicUrl,
          expiresIn: 3600,
          expiresAt: expiresAt.toISOString(),
        },
        'Presigned URL generated successfully'
      );
    })
  );
