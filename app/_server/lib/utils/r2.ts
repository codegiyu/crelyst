import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENVIRONMENT } from '../config/environment';
import { AppError } from './appError';
import { nanoid } from 'nanoid';
import type { UploadIntent, EntityType } from '../types/constants';

// Re-export types for backward compatibility
export type { UploadIntent, EntityType };

/**
 * R2 Configuration Variables Explanation:
 *
 * ACCOUNT_ID (Required):
 *   - Your Cloudflare account ID
 *   - Used to construct the R2 API endpoint URL
 *   - Format: https://{ACCOUNT_ID}.r2.cloudflarestorage.com
 *   - Example: "abc123def456ghi789"
 *
 * ACCESS_KEY_ID (Required):
 *   - Your R2 API access key ID
 *   - Used for authenticating API requests to R2
 *   - Generated in Cloudflare dashboard under R2 > Manage R2 API Tokens
 *   - Example: "your-access-key-id-here"
 *
 * SECRET_ACCESS_KEY (Required):
 *   - Your R2 API secret access key
 *   - Used together with ACCESS_KEY_ID for authentication
 *   - Keep this secure and never commit to version control
 *   - Only shown once when generated - save it securely
 *   - Example: "your-secret-access-key-here"
 *
 * BUCKET_NAME (Required):
 *   - The name of your R2 bucket where files will be stored
 *   - Must match exactly with the bucket name in Cloudflare dashboard
 *   - Used in all R2 operations (upload, delete, etc.)
 *   - Example: "pinpoint-uploads" or "production-assets"
 *
 * CDN_URL (Optional but recommended):
 *   - The public CDN URL for accessing uploaded files
 *   - Used as the primary URL for generating public file URLs
 *   - Typically a custom domain or Cloudflare CDN URL
 *   - Format: "https://cdn.yourdomain.com" or "https://your-bucket.r2.dev"
 *   - If not provided, PUBLIC_URL will be used as fallback
 *   - Example: "https://cdn.pinpoint-global.com"
 *
 * PUBLIC_URL (Optional):
 *   - Fallback public URL for accessing uploaded files
 *   - Used when CDN_URL is not configured
 *   - Can be the R2 public bucket URL or another public endpoint
 *   - Format: "https://your-bucket.r2.dev" or custom domain
 *   - Example: "https://your-bucket.r2.dev"
 *
 * Note: At least one of CDN_URL or PUBLIC_URL should be provided for public file access.
 */

// Validate critical R2 configuration variables
const validateR2Config = () => {
  const missingVars: string[] = [];

  if (!ENVIRONMENT.R2.ACCOUNT_ID || ENVIRONMENT.R2.ACCOUNT_ID.trim() === '') {
    missingVars.push('R2_ACCOUNT_ID');
  }

  if (!ENVIRONMENT.R2.ACCESS_KEY_ID || ENVIRONMENT.R2.ACCESS_KEY_ID.trim() === '') {
    missingVars.push('R2_ACCESS_KEY_ID');
  }

  if (!ENVIRONMENT.R2.SECRET_ACCESS_KEY || ENVIRONMENT.R2.SECRET_ACCESS_KEY.trim() === '') {
    missingVars.push('R2_SECRET_ACCESS_KEY');
  }

  if (!ENVIRONMENT.R2.BUCKET_NAME || ENVIRONMENT.R2.BUCKET_NAME.trim() === '') {
    missingVars.push('R2_BUCKET_NAME');
  }

  if (!ENVIRONMENT.R2.FOLDER_PREFIX || ENVIRONMENT.R2.FOLDER_PREFIX.trim() === '') {
    missingVars.push('R2_FOLDER_PREFIX');
  }

  if (missingVars.length > 0) {
    throw new AppError(
      `Missing or empty required R2 configuration variables: ${missingVars.join(', ')}. Please set these environment variables.`,
      500
    );
  }

  // Warn if neither CDN_URL nor PUBLIC_URL is set (optional but recommended)
  if (
    (!ENVIRONMENT.R2.CDN_URL || ENVIRONMENT.R2.CDN_URL.trim() === '') &&
    (!ENVIRONMENT.R2.PUBLIC_URL || ENVIRONMENT.R2.PUBLIC_URL.trim() === '')
  ) {
    console.warn(
      'Warning: Neither R2_CDN_URL nor R2_PUBLIC_URL is set. Public file URLs may not work correctly.'
    );
  }
};

// Validate configuration on module load
validateR2Config();

// Initialize S3 client for Cloudflare R2
// R2 is S3-compatible, so we can use AWS SDK
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
    secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
  },
});

interface GeneratePresignedUrlParams {
  entityType: EntityType;
  entityId: string;
  intent: UploadIntent;
  fileExtension?: string;
  contentType?: string;
  expiresIn?: number; // in seconds, default 3600 (1 hour)
}

/**
 * Generate a presigned URL for uploading files to R2
 * Folder structure: {entityType}/{entityId}/{intent}/{filename}
 */
export const generatePresignedUrl = async ({
  entityType,
  entityId,
  intent,
  fileExtension = '',
  contentType = 'application/octet-stream',
  expiresIn = 3600, // 1 hour default
}: GeneratePresignedUrlParams): Promise<{
  filename: string;
  url: string;
  key: string;
  publicUrl: string;
}> => {
  // Generate unique filename
  const filename = `${nanoid()}${fileExtension ? `.${fileExtension.replace('.', '')}` : ''}`;

  // Build object key with folder structure: {FOLDER_PREFIX}/{entityType}/{entityId}/{intent}/{filename}
  const folderPrefix = ENVIRONMENT.R2.FOLDER_PREFIX;
  const key = `${folderPrefix}/${entityType}/${entityId}/${intent}/${filename}`;

  // Create PutObject command
  const command = new PutObjectCommand({
    Bucket: ENVIRONMENT.R2.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // Generate presigned URL
  const url = await getSignedUrl(r2Client, command, { expiresIn });

  // Generate public URL (CDN URL or public R2 URL)
  const publicUrl = ENVIRONMENT.R2.CDN_URL
    ? `${ENVIRONMENT.R2.CDN_URL}/${key}`
    : `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`;

  return {
    filename,
    url,
    key,
    publicUrl,
  };
};

/**
 * Delete a file from R2
 */
export const deleteFileFromR2 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: ENVIRONMENT.R2.BUCKET_NAME,
    Key: key,
  });

  try {
    await r2Client.send(command);
  } catch (error) {
    // Log error but don't throw - file might not exist
    console.error('Failed to delete file from R2:', error);
    throw error;
  }
};

/**
 * Extract key from R2 URL
 */
export const extractKeyFromUrl = (url: string): string | null => {
  // Extract key from CDN URL or public URL
  const cdnUrl = ENVIRONMENT.R2.CDN_URL;
  const publicUrl = ENVIRONMENT.R2.PUBLIC_URL;

  if (cdnUrl && url.includes(cdnUrl)) {
    return url.replace(`${cdnUrl}/`, '');
  }

  if (publicUrl && url.includes(publicUrl)) {
    return url.replace(`${publicUrl}/`, '');
  }

  // Try to extract from bucket URL pattern
  const bucketPattern = new RegExp(`${ENVIRONMENT.R2.BUCKET_NAME}/(.+)`);
  const match = url.match(bucketPattern);
  if (match) {
    return match[1];
  }

  return null;
};

/**
 * Validate file extension and return appropriate content type
 */
export const getContentTypeFromExtension = (extension: string): string => {
  const ext = extension.toLowerCase().replace('.', '');
  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  };

  return contentTypes[ext] || 'application/octet-stream';
};
