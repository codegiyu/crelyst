import { z } from 'zod';
import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { generatePresignedUrl, getContentTypeFromExtension } from '../../lib/utils/r2';
import type { EntityType, UploadIntent } from '../../lib/types/constants';
import {
  ACCESS_TYPES,
  UPLOAD_INTENTS,
  ALLOWED_USER_UPLOAD_INTENTS,
} from '../../lib/types/constants';
import { getDocument } from '@/lib/firebase/firestore';
import {
  getBrandById,
  getServiceById,
  getProjectById,
  getPortfolioCaseStudyById,
  getTestimonialById,
  createDocument,
  getTeamMemberById,
} from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';

const presignedUrlBodySchema = z
  .object({
    entityType: z.enum([
      'user',
      'admin',
      'service',
      'project',
      'portfolio-case-study',
      'bbs-site-content',
      'testimonial',
      'brand',
      'team-member',
      'form-submission',
    ]),
    entityId: z.string().min(1, 'entityId is required'),
    intent: z.enum([
      'avatar',
      'logo',
      'card-image',
      'banner-image',
      'image',
      'other',
      'attachment',
    ]),
    fileExtension: z.string().optional(),
    contentType: z.string().optional(),
    files: z
      .array(
        z.object({
          fileExtension: z.string(),
          contentType: z.string(),
        })
      )
      .optional(),
  })
  .refine(
    data => {
      const hasSingle = data.fileExtension !== undefined && data.contentType !== undefined;
      const hasFiles = (data.files?.length ?? 0) > 0;
      return (hasSingle && !hasFiles) || (!hasSingle && hasFiles);
    },
    {
      message: 'Either provide fileExtension and contentType, or a files array (not both).',
    }
  );

const isValidEntityId = (id: unknown): id is string => {
  return typeof id === 'string' && id.trim().length > 0;
};

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const resolveContentType = (fileExtension: string, contentType: string, intent: UploadIntent) => {
  const extension = normalizeString(fileExtension) ?? '';
  let resolvedContentType = normalizeString(contentType);

  if (!resolvedContentType && extension) {
    resolvedContentType = getContentTypeFromExtension(extension);
  }

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

async function entityExists(entityType: EntityType, entityId: string): Promise<boolean> {
  switch (entityType) {
    case 'admin':
      return (await getDocument('admins', entityId)) !== null;
    case 'user':
      return (await getDocument('users', entityId)) !== null;
    case 'service':
      return (await getServiceById(entityId)) !== null;
    case 'project':
      return (await getProjectById(entityId)) !== null;
    case 'portfolio-case-study':
      return (await getPortfolioCaseStudyById(entityId)) !== null;
    case 'bbs-site-content':
      // Singleton doc id — allow upload before/without an existing Firestore row
      return entityId === 'content';
    case 'testimonial':
      return (await getTestimonialById(entityId)) !== null;
    case 'brand':
      return (await getBrandById(entityId)) !== null;
    case 'team-member':
      return (await getTeamMemberById(entityId)) !== null;
    default:
      return false;
  }
}

export const generatePresignedUrlController =
  (accessType: ACCESS_TYPES): RouteHandler =>
  async ({ body, user }) => {
    const payload = validateBody(presignedUrlBodySchema, body);

    const {
      entityType,
      entityId,
      intent,
      fileExtension,
      contentType,
      files: filesPayload,
    } = payload;

    const filesArray = filesPayload ?? [];

    const validatedEntityType = entityType as EntityType;

    const isUserAccess = accessType === 'client';

    const validateIntent = (value: unknown): UploadIntent => {
      if (!UPLOAD_INTENTS.includes(value as UploadIntent)) {
        throw new AppError(
          `Invalid intent "${value}". Must be one of: ${UPLOAD_INTENTS.join(', ')}`,
          400
        );
      }
      const intentVal = value as UploadIntent;
      if (isUserAccess && !ALLOWED_USER_UPLOAD_INTENTS.includes(intentVal)) {
        throw new AppError('Users can only upload avatar or other images', 403);
      }
      return intentVal;
    };

    const resolvedIntent = validateIntent(intent);

    if (!isValidEntityId(entityId)) {
      throw new AppError('Invalid entityId format', 400);
    }

    let targetEntityId: string = '';

    if (isUserAccess) {
      if (!user || !(user as { _id?: string })._id) {
        throw new AppError('IVT: Unauthenticated', 400);
      }

      const userId = String((user as { _id: string })._id);

      if (validatedEntityType !== 'user') {
        throw new AppError('Users can only upload files for their own account', 403);
      }

      if (entityId !== userId) {
        throw new AppError('Users can only upload files for their own account', 403);
      }

      targetEntityId = userId;
    } else {
      targetEntityId = entityId;

      const exists = await entityExists(validatedEntityType, entityId);
      if (!exists) {
        throw new AppError(`${validatedEntityType} not found`, 404);
      }
    }

    const expiresAt = new Date(Date.now() + 3600 * 1000);
    const uploadedByModel = accessType === 'client' ? 'Customer' : 'Admin';
    const uploadedBy =
      user && (user as { _id?: string })._id ? String((user as { _id: string })._id) : undefined;

    if (filesArray.length > 0) {
      if (filesArray.length > 20) {
        throw new AppError('You can only generate up to 20 presigned URLs per request', 400);
      }

      const uploads = await Promise.all(
        filesArray.map(async entry => {
          const { extension, contentType: resolvedContentType } = resolveContentType(
            entry.fileExtension,
            entry.contentType,
            resolvedIntent
          );

          const { filename, url, key, publicUrl } = await generatePresignedUrl({
            entityType: validatedEntityType,
            entityId: targetEntityId,
            intent: resolvedIntent,
            fileExtension: extension,
            contentType: resolvedContentType,
            expiresIn: 3600,
          });

          const document = await createDocument({
            entityType: validatedEntityType,
            entityId: targetEntityId,
            intent: resolvedIntent,
            filename,
            key,
            publicUrl,
            uploadUrl: url,
            fileExtension: extension,
            contentType: resolvedContentType,
            status: 'pending',
            expiresAt,
            uploadedBy,
            uploadedByModel,
          });

          return {
            id: document?.id,
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
        { uploads, count: uploads.length },
        'Presigned URLs generated successfully'
      );
    }

    if (!fileExtension) throw new AppError('fileExtension is required', 400);
    if (!contentType) throw new AppError('contentType is required', 400);

    const { extension: singleExtension, contentType: singleContentType } = resolveContentType(
      String(fileExtension),
      String(contentType),
      resolvedIntent
    );

    const { filename, url, key, publicUrl } = await generatePresignedUrl({
      entityType: validatedEntityType,
      entityId: targetEntityId,
      intent: resolvedIntent,
      fileExtension: singleExtension,
      contentType: singleContentType,
      expiresIn: 3600,
    });

    const document = await createDocument({
      entityType: validatedEntityType,
      entityId: targetEntityId,
      intent: resolvedIntent,
      filename,
      key,
      publicUrl,
      uploadUrl: url,
      fileExtension: singleExtension,
      contentType: singleContentType,
      status: 'pending',
      expiresAt,
      uploadedBy,
      uploadedByModel,
    });

    return sendResponse(
      200,
      {
        id: document?.id,
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
  };
