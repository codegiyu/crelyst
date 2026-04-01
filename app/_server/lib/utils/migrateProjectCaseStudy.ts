import { projectCaseStudySchema } from '../validation/projectCaseStudy';

/**
 * Heuristic upgrade for legacy flat case study documents (e.g. sibling `*Heading` keys
 * or `summary` stored as a bare paragraph array). Safe to run multiple times.
 */
export function migrateLegacyCaseStudyShape(raw: unknown): unknown {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return raw;
  }

  const o = { ...(raw as Record<string, unknown>) };

  const sectionKeys = [
    'aboutClient',
    'summary',
    'challenge',
    'strategy',
    'logoDesign',
    'visualIdentity',
    'applications',
    'results',
  ] as const;

  for (const sk of sectionKeys) {
    const val = o[sk];
    if (Array.isArray(val)) {
      o[sk] = { paragraphs: val };
    }
  }

  const headingKeyFor = (sectionKey: string) => `${sectionKey}Heading`;
  for (const sk of sectionKeys) {
    const hk = headingKeyFor(sk);
    const headingVal = o[hk];
    if (headingVal === undefined) continue;
    if (typeof headingVal === 'string') {
      const section = o[sk];
      if (section && typeof section === 'object' && !Array.isArray(section)) {
        const sec = section as Record<string, unknown>;
        const paragraphs = Array.isArray(sec.paragraphs) ? sec.paragraphs : [];
        o[sk] = {
          ...sec,
          heading: { headingTextStart: headingVal },
          paragraphs,
        };
      }
      delete o[hk];
    } else if (headingVal && typeof headingVal === 'object') {
      const section = o[sk];
      if (section && typeof section === 'object' && !Array.isArray(section)) {
        const sec = section as Record<string, unknown>;
        o[sk] = { ...sec, heading: headingVal };
      }
      delete o[hk];
    }
  }

  return o;
}

export function parseOrMigrateCaseStudy(raw: unknown):
  | {
      ok: true;
      value: unknown;
    }
  | {
      ok: false;
      issues: string;
    } {
  const first = projectCaseStudySchema.safeParse(raw);
  if (first.success) return { ok: true, value: first.data };

  const migrated = migrateLegacyCaseStudyShape(raw);
  const second = projectCaseStudySchema.safeParse(migrated);
  if (second.success) return { ok: true, value: second.data };

  return {
    ok: false,
    issues: second.error.issues.map(i => i.message).join('; ') || 'Invalid case study',
  };
}
