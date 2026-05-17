/** Stable remount key so settings tabs re-initialize form state when server/store data changes. */
export function settingsTabRemountKey(tabId: string, slice: unknown): string {
  return `${tabId}-${JSON.stringify(slice ?? null)}`;
}
