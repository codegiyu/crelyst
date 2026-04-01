/**
 * Deletes all Firestore documents in the `projects` collection.
 * Run before re-seeding if old slugs must not remain. Requires .env with Firebase admin config.
 *
 * Usage: npx tsx scripts/clear-projects.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const { deleteAllProjects } = await import('../app/_server/lib/firestore/collections');

async function main(): Promise<void> {
  const n = await deleteAllProjects();
  console.log(`Deleted ${n} project document(s).`);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
