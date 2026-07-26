/**
 * Seed / update Isaac owner service pricing content in Firestore.
 *
 * Usage:
 *   npm run migrate:isaac-service-content
 *   npm run migrate:isaac-service-content -- --verify-only
 */

import dotenv from 'dotenv';
import { mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  createService,
  getServiceBySlug,
  updateService,
  updateSiteSettingsSlice,
} from '../app/_server/lib/firestore/collections';
import {
  ISAAC_PROJECT_WORKFLOW,
  ISAAC_SERVICE_CONTENT_UPDATES,
  type IsaacServiceContentUpdate,
} from './lib/isaacOwnerServiceContent';

dotenv.config({ path: resolve(process.cwd(), '.env') });

type MigrationReportEntry = {
  slug: string;
  action: 'created' | 'updated' | 'skipped';
  fieldsWritten: string[];
};

type WorkflowReportEntry = {
  slice: 'projectWorkflow';
  action: 'updated';
  fieldsWritten: string[];
};

function getFieldsWritten(update: IsaacServiceContentUpdate): string[] {
  if (update.mergeFields?.length) return update.mergeFields;

  return Object.keys(update.payload);
}

async function upsertServiceContent(
  update: IsaacServiceContentUpdate
): Promise<MigrationReportEntry> {
  const existing = await getServiceBySlug(update.slug);
  const fieldsWritten = getFieldsWritten(update);

  if (existing) {
    const payload = update.mergeFields?.length
      ? Object.fromEntries(
          update.mergeFields
            .filter(field => update.payload[field] !== undefined)
            .map(field => [field, update.payload[field]])
        )
      : update.payload;

    await updateService(existing.id, payload);
    return { slug: update.slug, action: 'updated', fieldsWritten };
  }

  if (!update.payload.title || !update.payload.description) {
    return { slug: update.slug, action: 'skipped', fieldsWritten };
  }

  await createService(update.payload);
  return { slug: update.slug, action: 'created', fieldsWritten };
}

function comparePackagePricing(stored: unknown, expected: unknown): string[] {
  const issues: string[] = [];
  const storedCategories = Array.isArray(stored) ? stored : [];
  const expectedCategories = Array.isArray(expected) ? expected : [];

  if (storedCategories.length !== expectedCategories.length) {
    issues.push('packagePricing category count mismatch');
    return issues;
  }

  expectedCategories.forEach((expectedCategory, categoryIndex) => {
    const storedCategory = storedCategories[categoryIndex] as {
      packages?: Array<{ id?: string; priceRange?: number[] }>;
    };
    const expectedPackages = (expectedCategory as { packages?: unknown[] }).packages ?? [];
    const storedPackages = storedCategory?.packages ?? [];

    if (storedPackages.length !== expectedPackages.length) {
      issues.push(`${categoryIndex}: package count mismatch`);
      return;
    }

    expectedPackages.forEach((expectedPackage, packageIndex) => {
      const storedPackage = storedPackages[packageIndex] as {
        id?: string;
        priceRange?: number[];
      };
      const expectedId = (expectedPackage as { id?: string }).id;
      const expectedMin = (expectedPackage as { priceRange?: number[] }).priceRange?.[0];

      if (storedPackage?.id !== expectedId) {
        issues.push(`${expectedId ?? packageIndex}: package id mismatch`);
      }
      if (storedPackage?.priceRange?.[0] !== expectedMin) {
        issues.push(`${expectedId ?? packageIndex}: starting price mismatch`);
      }
    });
  });

  return issues;
}

async function upsertProjectWorkflow(): Promise<WorkflowReportEntry> {
  await updateSiteSettingsSlice('settings', 'projectWorkflow', ISAAC_PROJECT_WORKFLOW);
  return {
    slice: 'projectWorkflow',
    action: 'updated',
    fieldsWritten: ['title', 'subtitle', 'steps'],
  };
}

function normalizeProjectWorkflow(value: unknown) {
  if (!value || typeof value !== 'object') return null;

  const workflow = value as {
    title?: string;
    subtitle?: string;
    steps?: Array<{ title?: string; description?: string; order?: number }>;
  };

  return {
    title: workflow.title ?? '',
    subtitle: workflow.subtitle ?? '',
    steps: [...(workflow.steps ?? [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((step, index) => ({
        title: step.title ?? '',
        description: step.description ?? '',
        order: index,
      })),
  };
}

function projectWorkflowsEqual(stored: unknown, expected: typeof ISAAC_PROJECT_WORKFLOW): boolean {
  return (
    JSON.stringify(normalizeProjectWorkflow(stored)) ===
    JSON.stringify(normalizeProjectWorkflow(expected))
  );
}

async function verifyProjectWorkflow(): Promise<number> {
  const { getSiteSettingsSlice } = await import('../app/_server/lib/firestore/collections');
  const stored = await getSiteSettingsSlice('settings', 'projectWorkflow');
  const issues: string[] = [];

  if (!stored) {
    issues.push('missing projectWorkflow slice');
  } else if (!projectWorkflowsEqual(stored, ISAAC_PROJECT_WORKFLOW)) {
    issues.push('projectWorkflow content mismatch');
  }

  issues.forEach(issue => console.error(`[verify] projectWorkflow: ${issue}`));
  return issues.length;
}

async function verifyContent(): Promise<void> {
  let mismatches = 0;

  for (const update of ISAAC_SERVICE_CONTENT_UPDATES) {
    const stored = await getServiceBySlug(update.slug);
    if (!stored) {
      console.error(`[verify] missing service: ${update.slug}`);
      mismatches++;
      continue;
    }

    const fieldsToCheck = update.mergeFields?.length
      ? update.mergeFields
      : ['packagePricing', 'pricingFooter', 'title'];

    for (const field of fieldsToCheck) {
      if (field === 'packagePricing') {
        const issues = comparePackagePricing(
          (stored as Record<string, unknown>).packagePricing,
          update.payload.packagePricing
        );
        issues.forEach(issue => {
          console.error(`[verify] ${update.slug} packagePricing: ${issue}`);
          mismatches++;
        });
        continue;
      }

      const storedValue = (stored as Record<string, unknown>)[field];
      const expectedValue = update.payload[field];
      if (JSON.stringify(storedValue) !== JSON.stringify(expectedValue)) {
        console.error(`[verify] ${update.slug}.${field} mismatch`);
        mismatches++;
      }
    }
  }

  mismatches += await verifyProjectWorkflow();

  if (mismatches === 0) {
    console.log('[verify] Isaac service content checks passed.');
  } else {
    console.error(`[verify] ${mismatches} issue(s) found.`);
    process.exitCode = 1;
  }
}

async function main(): Promise<void> {
  const verifyOnly = process.argv.includes('--verify-only');

  console.log(`Loaded ${ISAAC_SERVICE_CONTENT_UPDATES.length} Isaac service content updates.`);

  if (verifyOnly) {
    await verifyContent();
    return;
  }

  const report: {
    services: MigrationReportEntry[];
    workflow: WorkflowReportEntry;
  } = {
    services: [],
    workflow: await upsertProjectWorkflow(),
  };

  for (const update of ISAAC_SERVICE_CONTENT_UPDATES) {
    const entry = await upsertServiceContent(update);
    report.services.push(entry);
    console.log(`[${entry.action}] ${entry.slug} (${entry.fieldsWritten.join(', ')})`);
  }

  console.log(
    `[${report.workflow.action}] ${report.workflow.slice} (${report.workflow.fieldsWritten.join(', ')})`
  );

  const reportDir = resolve(process.cwd(), 'scripts/migration-reports');
  mkdirSync(reportDir, { recursive: true });
  const reportPath = resolve(reportDir, 'isaac-service-content-latest.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nReport written to ${reportPath}`);

  await verifyContent();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
