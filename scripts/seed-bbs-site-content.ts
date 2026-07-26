/**
 * Seed Bold Brand Studio about/contact/SEO into Firestore bbsSiteContent/content.
 * Uploads the about portrait, OG image, and favicon from bold-brand-studio when present.
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
const FAVICON_RELATIVE = join('..', 'bold-brand-studio', 'public', 'favicon.png');
const PORTRAIT_KEY = 'bbs-site-content/content/about-portrait.jpg';
const OG_KEY = 'bbs-site-content/content/og-default.jpg';
const FAVICON_KEY = 'bbs-site-content/content/favicon.png';

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

async function ensureAssetUrl(options: {
  localRelative: string;
  key: string;
  extension: string;
  label: string;
}): Promise<{ imageUrl: string; uploaded: boolean; skipped: boolean }> {
  const localPath = resolve(process.cwd(), options.localRelative);
  if (!existsSync(localPath)) {
    console.warn(
      `[seed-bbs-site-content] ${options.label} not found at ${localPath}; seeding empty URL`
    );
    return { imageUrl: '', uploaded: false, skipped: true };
  }

  const exists = await objectExists(options.key);
  if (exists) {
    return { imageUrl: publicUrlForKey(options.key), uploaded: false, skipped: true };
  }

  const body = readFileSync(localPath);
  await r2Client.send(
    new PutObjectCommand({
      Bucket: ENVIRONMENT.R2.BUCKET_NAME,
      Key: options.key,
      Body: body,
      ContentType: getContentTypeFromExtension(options.extension),
    })
  );

  return { imageUrl: publicUrlForKey(options.key), uploaded: true, skipped: false };
}

async function main() {
  const portrait = await ensureAssetUrl({
    localRelative: PORTRAIT_RELATIVE,
    key: PORTRAIT_KEY,
    extension: 'jpg',
    label: 'portrait',
  });
  const ogImage = await ensureAssetUrl({
    localRelative: PORTRAIT_RELATIVE,
    key: OG_KEY,
    extension: 'jpg',
    label: 'og image',
  });
  const favicon = await ensureAssetUrl({
    localRelative: FAVICON_RELATIVE,
    key: FAVICON_KEY,
    extension: 'png',
    label: 'favicon',
  });

  const content = {
    ...DEFAULT_BBS_SITE_CONTENT,
    about: {
      ...DEFAULT_BBS_SITE_CONTENT.about,
      imageUrl: portrait.imageUrl || DEFAULT_BBS_SITE_CONTENT.about.imageUrl,
    },
    seo: {
      ...DEFAULT_BBS_SITE_CONTENT.seo,
      ogImageUrl: ogImage.imageUrl || DEFAULT_BBS_SITE_CONTENT.seo.ogImageUrl,
      faviconUrl: favicon.imageUrl || DEFAULT_BBS_SITE_CONTENT.seo.faviconUrl,
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
        ogImage,
        favicon,
        aboutImageUrl: parsed.data.about.imageUrl,
        seo: parsed.data.seo,
        projectsListingSeo: parsed.data.projectsListingSeo,
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
