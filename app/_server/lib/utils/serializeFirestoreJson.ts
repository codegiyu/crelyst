import { Timestamp } from 'firebase-admin/firestore';

/** Recursively convert Firestore Timestamps (and Dates) to ISO strings for JSON responses. */
export function serializeFirestoreForJson(value: unknown): unknown {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeFirestoreForJson);
  }
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      out[k] = serializeFirestoreForJson(v);
    }
    return out;
  }
  return value;
}
