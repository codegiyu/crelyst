/* eslint-disable @typescript-eslint/no-explicit-any */
export const storageKeys = {
  AUTH_EXPIRES_IN: {
    key: 'auth-expires-in',
    shouldBeParsed: false,
    isEncoded: false,
    fallbackString: '',
  },
  SIDEBAR_COLLAPSED: {
    key: 'sb_c',
    shouldBeParsed: false,
    isEncoded: false,
    fallbackString: '',
  },
};

export type AllowedStorageKeys = keyof typeof storageKeys;

export function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(input: string, shouldBeParsed: boolean = false): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  return shouldBeParsed ? JSON.parse(atob(normalized)) : atob(normalized);
}

const storageService = (type: 'session' | 'local') => {
  if (typeof window === 'undefined') {
    return;
  }

  const storage = type === 'local' ? localStorage : sessionStorage;

  const remove = (key: AllowedStorageKeys | AllowedStorageKeys[]) => {
    if (!Array.isArray(key)) {
      storage.removeItem(storageKeys[key].key);
      return;
    }

    key.forEach(item => {
      storage.removeItem(storageKeys[item].key);
    });
  };

  const get = (name: AllowedStorageKeys) => {
    const { key, shouldBeParsed, isEncoded, fallbackString } = storageKeys[name];

    const item = storage.getItem(key);

    if (!item) {
      return shouldBeParsed ? JSON.parse(fallbackString) : fallbackString;
    }

    try {
      if (isEncoded) {
        return base64UrlDecode(item, shouldBeParsed);
      }

      return shouldBeParsed ? JSON.parse(item) : item;
    } catch (error) {
      remove(name);
      console.error({ error });
      return null;
    }
  };

  const set = (
    key: AllowedStorageKeys,
    value: any,
    options?: {
      replacer?: (this: any, key: string, value: any) => any;
      space?: string | number;
    }
  ) => {
    const { key: storageKey, isEncoded } = storageKeys[key];
    const data =
      typeof value === 'string' ? value : JSON.stringify(value, options?.replacer, options?.space);

    const valueToBeStored = isEncoded ? base64UrlEncode(data) : data;

    storage.setItem(storageKey, valueToBeStored);
  };

  const shallowUpdate = (key: AllowedStorageKeys, value: any) => {
    const currentValue = get(key);

    set(key, { ...(currentValue ?? {}), ...value });
  };

  const clearAll = () => {
    storage.clear();
  };

  return { get, set, shallowUpdate, remove, clearAll };
};

export const localStorageService = storageService('local');
export const sessionStorageService = storageService('session');
