/**
 * Database seeding script
 * Seeds Firestore: site settings, brands, services, projects, testimonials, team members, and admins.
 *
 * Usage: npm run seed
 */

import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

async function seed(): Promise<void> {
  const { seedFirestore } = await import('../app/_server/lib/seed/seedFirestore');

  console.log('Seeding Firestore...\n');
  try {
    await seedFirestore();
    console.log('\nSeeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
