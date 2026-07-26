/**
 * One-time migration: seed portfolioCaseStudies from bold-brand-studio/src/data/projects.ts
 *
 * Usage: npx tsx scripts/migrate-bold-brand-studio-content.ts
 *        npx tsx scripts/migrate-bold-brand-studio-content.ts --verify-only
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { PutObjectCommand, S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import {
  loadBoldBrandProjects,
  collectLocalImagePaths,
  migrationStorageKey,
  type LoadedBoldBrandProject,
} from './lib/loadBoldBrandProjects';
import { portfolioCaseStudyContentSchema } from '../app/_server/controllers/portfolio-case-studies/schema';
import { ENVIRONMENT } from '../lib/config/environment';
import { getContentTypeFromExtension } from '../app/_server/lib/utils/r2';

dotenv.config({ path: resolve(process.cwd(), '.env') });

type MigrationReportEntry = {
  slug: string;
  displayOrder: number;
  fieldsWritten: string[];
  imagesUploaded: Array<{ localPath: string; key: string; publicUrl: string; skipped: boolean }>;
  unmappedFields: string[];
};

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

async function uploadLocalImage(
  key: string,
  localPath: string
): Promise<{ publicUrl: string; skipped: boolean }> {
  const exists = await objectExists(key);
  if (exists) {
    return { publicUrl: publicUrlForKey(key), skipped: true };
  }

  const ext = localPath.split('.').pop() ?? 'png';
  const body = readFileSync(localPath);
  await r2Client.send(
    new PutObjectCommand({
      Bucket: ENVIRONMENT.R2.BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: getContentTypeFromExtension(ext),
    })
  );

  return { publicUrl: publicUrlForKey(key), skipped: false };
}

function replaceLocalPaths(value: unknown, pathMap: Map<string, string>): unknown {
  if (typeof value === 'string') {
    const normalized = value.replace(/\\/g, '/');
    return pathMap.get(normalized) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map(item => replaceLocalPaths(item, pathMap));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceLocalPaths(v, pathMap)])
    );
  }
  return value;
}

function toFirestoreDoc(
  project: LoadedBoldBrandProject,
  displayOrder: number,
  pathMap: Map<string, string>
) {
  const { ...rest } = project;
  const withUrls = replaceLocalPaths(rest, pathMap) as Record<string, unknown>;

  return {
    ...withUrls,
    isActive: true,
    displayOrder,
  };
}

async function migrateProject(
  project: LoadedBoldBrandProject,
  displayOrder: number
): Promise<MigrationReportEntry> {
  const slug = String(project.slug);
  const localPaths = collectLocalImagePaths(project);
  const pathMap = new Map<string, string>();
  const imagesUploaded: MigrationReportEntry['imagesUploaded'] = [];

  for (const localPath of localPaths) {
    const key = migrationStorageKey(slug, localPath);
    const { publicUrl, skipped } = await uploadLocalImage(key, localPath);
    pathMap.set(localPath.replace(/\\/g, '/'), publicUrl);
    imagesUploaded.push({ localPath, key, publicUrl, skipped });
  }

  const doc = toFirestoreDoc(project, displayOrder, pathMap);
  const parsed = portfolioCaseStudyContentSchema.safeParse(doc);
  const unmappedFields: string[] = [];

  if (!parsed.success) {
    unmappedFields.push(...parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
  }

  const { upsertPortfolioCaseStudyBySlug } = await import(
    '../app/_server/lib/firestore/collections'
  );
  await upsertPortfolioCaseStudyBySlug(slug, doc);

  return {
    slug,
    displayOrder,
    fieldsWritten: Object.keys(doc),
    imagesUploaded,
    unmappedFields,
  };
}

async function verifyParity(sourceProjects: LoadedBoldBrandProject[]) {
  const { getPortfolioCaseStudyBySlug } = await import('../app/_server/lib/firestore/collections');

  let mismatches = 0;
  for (let i = 0; i < sourceProjects.length; i++) {
    const source = sourceProjects[i];
    const stored = await getPortfolioCaseStudyBySlug(String(source.slug));
    if (!stored) {
      console.error(`[verify] missing in Firestore: ${source.slug}`);
      mismatches++;
      continue;
    }
    if ((stored as { displayOrder?: number }).displayOrder !== i + 1) {
      console.error(`[verify] order mismatch for ${source.slug}`);
      mismatches++;
    }
    if (!(stored as { results?: unknown[] }).results?.length) {
      console.error(`[verify] empty results for ${source.slug}`);
      mismatches++;
    }
    const hasLogoInSource = Boolean(source.logoDesign);
    const hasLogoInStore = Boolean((stored as { logoDesign?: unknown }).logoDesign);
    if (hasLogoInSource !== hasLogoInStore) {
      console.error(`[verify] logoDesign presence mismatch for ${source.slug}`);
      mismatches++;
    }
  }

  if (mismatches === 0) {
    console.log('[verify] Field-parity, ordering, results, and logoDesign checks passed.');
  } else {
    console.error(`[verify] ${mismatches} issue(s) found.`);
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const verifyOnly = process.argv.includes('--verify-only');
  const sourceProjects = await loadBoldBrandProjects();

  console.log(`Loaded ${sourceProjects.length} projects from bold-brand-studio.`);

  if (verifyOnly) {
    await verifyParity(sourceProjects);
    return;
  }

  const report: MigrationReportEntry[] = [];

  for (let i = 0; i < sourceProjects.length; i++) {
    const entry = await migrateProject(sourceProjects[i], i + 1);
    report.push(entry);
    console.log(`[migrated] ${entry.slug} (${entry.imagesUploaded.length} images)`);
    if (entry.unmappedFields.length > 0) {
      console.warn(`  unmapped: ${entry.unmappedFields.join('; ')}`);
    }
  }

  const reportPath = resolve(
    process.cwd(),
    'scripts/migration-reports/bold-brand-studio-latest.json'
  );
  const { mkdirSync } = await import('fs');
  mkdirSync(resolve(process.cwd(), 'scripts/migration-reports'), { recursive: true });
  const { writeFileSync } = await import('fs');
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nReport written to ${reportPath}`);

  await verifyParity(sourceProjects);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
