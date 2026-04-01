import { describe, it, expect } from 'vitest';
import { migrateLegacyCaseStudyShape, parseOrMigrateCaseStudy } from './migrateProjectCaseStudy';

const visualIdentity = {
  identityImages: [] as string[],
  colorPalette: [{ name: 'Black', hex: '#000000' }],
  typographyPrimary: 'Primary',
  typographySecondary: 'Secondary',
};

function legacyFlatWithHeading() {
  return {
    industry: 'Food',
    services: ['Branding'],
    engagementTimeline: '4 weeks',
    summaryHeading: 'Our overview headline',
    summary: [{ text: 'Summary body.' }],
    challenge: { paragraphs: [{ text: 'Challenge text.' }] },
    strategy: { paragraphs: [{ text: 'Strategy text.' }] },
    visualIdentity,
    results: { metrics: [{ label: 'Reach', value: '10x' }] },
    keywords: ['brand'],
  };
}

describe('migrateLegacyCaseStudyShape', () => {
  it('merges sibling *Heading string into section.heading', () => {
    const migrated = migrateLegacyCaseStudyShape(legacyFlatWithHeading()) as Record<
      string,
      unknown
    >;
    expect(migrated.summaryHeading).toBeUndefined();
    const summary = migrated.summary as {
      heading?: { headingTextStart?: string };
      paragraphs?: unknown[];
    };
    expect(summary.heading?.headingTextStart).toBe('Our overview headline');
    expect(Array.isArray(summary.paragraphs)).toBe(true);
  });
});

describe('parseOrMigrateCaseStudy', () => {
  it('parses already-valid nested case studies', () => {
    const nested = {
      industry: 'Food',
      services: ['Branding'],
      engagementTimeline: '4 weeks',
      summary: { paragraphs: [{ text: 'Summary body.' }] },
      challenge: { paragraphs: [{ text: 'Challenge text.' }] },
      strategy: { paragraphs: [{ text: 'Strategy text.' }] },
      visualIdentity,
      results: { metrics: [{ label: 'Reach', value: '10x' }] },
      keywords: ['brand'],
    };
    const r = parseOrMigrateCaseStudy(nested);
    expect(r.ok).toBe(true);
  });

  it('migrates flat legacy shape to a valid case study', () => {
    const r = parseOrMigrateCaseStudy(legacyFlatWithHeading());
    expect(r.ok).toBe(true);
  });
});
