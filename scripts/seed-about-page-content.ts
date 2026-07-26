/**
 * Seed siteSettings.aboutPage from the current public about defaults.
 *
 * Usage: npx tsx scripts/seed-about-page-content.ts
 */

import dotenv from 'dotenv';
import { resolve } from 'path';
import { aboutPageContentSchema } from '../app/_server/controllers/site/aboutPageSchema';
import { DEFAULT_ABOUT_PAGE_CONTENT } from '../lib/types/about-page';
import { updateSiteSettingsSlice } from '../app/_server/lib/firestore/collections';

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function main() {
  const parsed = aboutPageContentSchema.safeParse(DEFAULT_ABOUT_PAGE_CONTENT);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    process.exit(1);
  }

  await updateSiteSettingsSlice('settings', 'aboutPage', parsed.data);
  console.log('[seed-about-page-content] seeded siteSettings/settings.aboutPage');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
