import type { ISiteSettings } from '../../lib/types/constants';
import type { Portion } from './fetchSettings';

/** Per-slice keys that must not be exposed on unauthenticated public reads. */
const SENSITIVE_KEYS_BY_SLICE: Partial<Record<Portion, readonly string[]>> = {
  email: ['fromEmail', 'replyToEmail'],
};

function omitKeys<T extends Record<string, unknown>>(value: T, keys: readonly string[]): T {
  const redacted = { ...value };
  for (const key of keys) {
    delete redacted[key];
  }
  return redacted;
}

export function redactSensitiveSliceValue(slice: Portion, value: unknown): unknown {
  const sensitiveKeys = SENSITIVE_KEYS_BY_SLICE[slice];
  if (
    !sensitiveKeys?.length ||
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return value;
  }

  return omitKeys(value as Record<string, unknown>, sensitiveKeys);
}

export function redactSensitiveSettings<T extends ISiteSettings | Partial<ISiteSettings>>(
  settings: T,
  slice: Portion
): T {
  if (slice === 'all') {
    const redacted = { ...settings } as Record<string, unknown>;

    for (const [sliceName, keys] of Object.entries(SENSITIVE_KEYS_BY_SLICE) as [
      Portion,
      readonly string[],
    ][]) {
      if (!keys.length || !(sliceName in redacted)) continue;
      redacted[sliceName] = redactSensitiveSliceValue(sliceName, redacted[sliceName]);
    }

    return redacted as T;
  }

  const sliceValue = (settings as Record<string, unknown>)[slice];
  if (sliceValue === undefined) return settings;

  return {
    ...settings,
    [slice]: redactSensitiveSliceValue(slice, sliceValue),
  };
}
