/** Firestore rejects `undefined` field values unless ignoreUndefinedProperties is set. */
export function omitUndefinedFields<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
