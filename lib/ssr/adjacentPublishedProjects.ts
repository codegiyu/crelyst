import { listProjects } from '@/app/_server/lib/firestore/collections';
import { adminDb } from '@/lib/firebase/admin';

export type AdjacentProjectNav = { slug: string; title: string };

type ProjectRow = Record<string, unknown> & { id: string };

export async function getAdjacentPublishedProjects(
  currentSlug: string
): Promise<{ prev: AdjacentProjectNav | null; next: AdjacentProjectNav | null }> {
  if (!adminDb) {
    return { prev: null, next: null };
  }
  const { items } = await listProjects({ isActive: true, limit: 500, page: 1 });
  const rows = items as ProjectRow[];
  const sorted = [...rows].sort((a, b) => {
    const da = typeof a.displayOrder === 'number' ? a.displayOrder : 0;
    const db = typeof b.displayOrder === 'number' ? b.displayOrder : 0;
    if (da !== db) return da - db;
    const ta = typeof a.title === 'string' ? a.title : '';
    const tb = typeof b.title === 'string' ? b.title : '';
    return ta.localeCompare(tb);
  });

  const idx = sorted.findIndex(p => p.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };

  const toNav = (p: ProjectRow | undefined): AdjacentProjectNav | null => {
    if (!p || typeof p.slug !== 'string') return null;
    return {
      slug: p.slug,
      title: typeof p.title === 'string' ? p.title : p.slug,
    };
  };

  return {
    prev: toNav(sorted[idx - 1]),
    next: toNav(sorted[idx + 1]),
  };
}
