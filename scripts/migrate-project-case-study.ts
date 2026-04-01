/**
 * One-off migration: upgrade legacy flat `caseStudy` objects on projects to the nested schema.
 *
 * Skips documents that already validate. Run after backing up Firestore if unsure.
 *
 * Usage: npx tsx scripts/migrate-project-case-study.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { Timestamp } from 'firebase-admin/firestore';

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function main(): Promise<void> {
  const { getCollection } = await import('../app/_server/lib/firestore/collections');
  const { projectCaseStudySchema } = await import('../app/_server/lib/validation/projectCaseStudy');
  const { parseOrMigrateCaseStudy } = await import(
    '../app/_server/lib/utils/migrateProjectCaseStudy'
  );

  const coll = getCollection('projects');
  const snap = await coll.get();
  let migrated = 0;
  let skippedOk = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const cs = data.caseStudy;
    if (cs == null || typeof cs !== 'object') {
      skippedOk++;
      continue;
    }

    if (projectCaseStudySchema.safeParse(cs).success) {
      skippedOk++;
      continue;
    }

    const result = parseOrMigrateCaseStudy(cs);
    if (!result.ok) {
      console.warn(`[skip] ${doc.id} slug=${String(data.slug)}: ${result.issues}`);
      continue;
    }

    await doc.ref.update({
      caseStudy: result.value,
      updatedAt: Timestamp.now(),
    });
    migrated++;
    console.log(`[migrated] ${doc.id} slug=${String(data.slug)}`);
  }

  console.log(`\nDone. Migrated: ${migrated}. Already valid or empty: ${skippedOk}.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
