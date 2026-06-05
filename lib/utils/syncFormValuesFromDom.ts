/** Merge named fields from FormData into controlled form state (handles browser autofill). */
export function syncFormValuesFromFormData<T extends Record<string, unknown>>(
  formData: FormData,
  currentValues: T,
  fieldNames: (keyof T)[]
): T {
  let changed = false;
  const synced = { ...currentValues };

  for (const key of fieldNames) {
    const raw = formData.get(String(key));

    if (typeof raw === 'string' && raw !== synced[key]) {
      synced[key] = raw as T[keyof T];
      changed = true;
    }
  }

  return changed ? synced : currentValues;
}

export function syncFormValuesFromDom<T extends Record<string, unknown>>(
  form: HTMLFormElement | null | undefined,
  currentValues: T,
  fieldNames: (keyof T)[]
): T {
  if (!form) return currentValues;

  return syncFormValuesFromFormData(new FormData(form), currentValues, fieldNames);
}
