import type { IAdminSearchHit } from '@/lib/constants/endpoints';

export function adminSearchHitHref(base: string, hit: IAdminSearchHit): string {
  return `${base}?edit=${encodeURIComponent(hit.id)}`;
}

export function findEntityByEditId<T extends { _id: string }>(
  items: T[],
  editId: string | null
): T | null {
  if (!editId) return null;
  return items.find(item => item._id === editId) ?? null;
}
