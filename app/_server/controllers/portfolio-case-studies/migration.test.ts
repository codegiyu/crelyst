import { describe, it, expect } from 'vitest';
import {
  loadBoldBrandProjects,
  collectLocalImagePaths,
  migrationStorageKey,
} from '../../../../scripts/lib/loadBoldBrandProjects';

describe('loadBoldBrandProjects', () => {
  it('loads all projects from bold-brand-studio with expected slugs', async () => {
    const projects = await loadBoldBrandProjects();
    expect(projects.length).toBe(6);
    expect(projects.map(p => p.slug)).toEqual([
      'techxforge-global',
      'abbys-fragrance',
      'purestart',
      'nextron',
      'davora',
      'pixelore',
    ]);
  });

  it('resolves image imports to local asset paths', async () => {
    const projects = await loadBoldBrandProjects();
    const techxforge = projects.find(p => p.slug === 'techxforge-global');
    expect(typeof techxforge?.image).toBe('string');
    expect(String(techxforge?.image)).toMatch(/assets/i);
    const paths = collectLocalImagePaths(techxforge);
    expect(paths.size).toBeGreaterThan(0);
  });

  it('builds deterministic migration storage keys', () => {
    const key = migrationStorageKey('nextron', 'C:/repo/src/assets/Nextron.png');
    expect(key).toMatch(/portfolio-migration\/nextron\/Nextron\.png$/);
  });
});
