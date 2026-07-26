/**
 * Seed Bold Brand Studio about/contact into Firestore bbsSiteContent/content.
 * Uploads the about portrait from bold-brand-studio assets when present.
 *
 * Usage: npx tsx scripts/seed-bbs-site-content.ts
 */

import dotenv from 'dotenv';
import { resolve, join } from 'path';
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { PutObjectCommand, S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import {
  bbsSiteContentSchema,
  DEFAULT_BBS_SITE_CONTENT,
} from '../app/_server/controllers/bbs-site-content/schema';
import { setBbsSiteContent } from '../app/_server/lib/firestore/collections';
import { ENVIRONMENT } from '../lib/config/environment';
import { getContentTypeFromExtension } from '../app/_server/lib/utils/r2';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const PORTRAIT_RELATIVE = join('..', 'bold-brand-studio', 'src', 'assets', '2H0A0127.jpg');
const PORTRAIT_KEY = 'bbs-site-content/content/about-portrait.jpg';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${ENVIRONMENT.R2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ENVIRONMENT.R2.ACCESS_KEY_ID,
    secretAccessKey: ENVIRONMENT.R2.SECRET_ACCESS_KEY,
  },
});

function publicUrlForKey(key: string): string {
  return ENVIRONMENT.R2.CDN_URL
    ? `${ENVIRONMENT.R2.CDN_URL}/${key}`
    : `${ENVIRONMENT.R2.PUBLIC_URL}/${key}`;
}

async function objectExists(key: string): Promise<boolean> {
  try {
    await r2Client.send(new HeadObjectCommand({ Bucket: ENVIRONMENT.R2.BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function ensurePortraitUrl(): Promise<{
  imageUrl: string;
  uploaded: boolean;
  skipped: boolean;
}> {
  const localPath = resolve(process.cwd(), PORTRAIT_RELATIVE);
  if (!existsSync(localPath)) {
    console.warn(
      `[seed-bbs-site-content] portrait not found at ${localPath}; seeding empty imageUrl`
    );
    return { imageUrl: '', uploaded: false, skipped: true };
  }

  const exists = await objectExists(PORTRAIT_KEY);
  if (exists) {
    return { imageUrl: publicUrlForKey(PORTRAIT_KEY), uploaded: false, skipped: true };
  }

  const body = readFileSync(localPath);
  await r2Client.send(
    new PutObjectCommand({
      Bucket: ENVIRONMENT.R2.BUCKET_NAME,
      Key: PORTRAIT_KEY,
      Body: body,
      ContentType: getContentTypeFromExtension('jpg'),
    })
  );

  return { imageUrl: publicUrlForKey(PORTRAIT_KEY), uploaded: true, skipped: false };
}

async function main() {
  const portrait = await ensurePortraitUrl();

  const content = {
    ...DEFAULT_BBS_SITE_CONTENT,
    about: {
      ...DEFAULT_BBS_SITE_CONTENT.about,
      imageUrl: portrait.imageUrl || DEFAULT_BBS_SITE_CONTENT.about.imageUrl,
    },
  };

  const parsed = bbsSiteContentSchema.safeParse(content);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    process.exit(1);
  }

  await setBbsSiteContent(parsed.data);

  const reportDir = resolve(process.cwd(), 'scripts/migration-reports');
  mkdirSync(reportDir, { recursive: true });
  const reportPath = join(reportDir, 'bbs-site-content-latest.json');
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        seededAt: new Date().toISOString(),
        portrait,
        aboutImageUrl: parsed.data.about.imageUrl,
        contactEmail: parsed.data.contact.email,
        socialCount: parsed.data.contact.socials.length,
      },
      null,
      2
    )
  );

  console.log(`[seed-bbs-site-content] seeded bbsSiteContent/content`);
  console.log(`[seed-bbs-site-content] report → ${reportPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
