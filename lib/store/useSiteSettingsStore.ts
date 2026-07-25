'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientSiteSettings } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export type SiteSettingsSlice =
  | 'all'
  | 'appDetails'
  | 'seo'
  | 'legal'
  | 'email'
  | 'features'
  | 'analytics'
  | 'localization'
  | 'branding'
  | 'projectWorkflow'
  | 'contactInfo'
  | 'socials';

export interface SiteSettingsStore {
  settings: Partial<ClientSiteSettings> | null;
  loadedSlices: Set<SiteSettingsSlice>;
  isLoading: boolean;
  lastFetched: Date | null;
  lastError: string | null;

  actions: {
    fetchSettings: (
      slice?: SiteSettingsSlice,
      options?: { force?: boolean }
    ) => Promise<{ ok: boolean; errorMessage?: string }>;
    fetchAllSettings: (options?: {
      force?: boolean;
    }) => Promise<{ ok: boolean; errorMessage?: string }>;
    setSettings: (settings: Partial<ClientSiteSettings>) => void;
    updateSettings: (updates: Partial<ClientSiteSettings>) => void;
    clearCache: () => void;
    clearError: () => void;
    isSliceLoaded: (slice: SiteSettingsSlice) => boolean;
  };
}

type InitialSiteSettingsStore = Omit<SiteSettingsStore, 'actions'>;

const initialData: InitialSiteSettingsStore = {
  settings: null,
  loadedSlices: new Set(),
  isLoading: false,
  lastFetched: null,
  lastError: null,
};

const CACHE_DURATION_MINUTES = 10;

const isCacheValid = (lastFetched: Date | null): boolean => {
  if (!lastFetched) return false;
  return differenceInMinutes(new Date(), lastFetched) < CACHE_DURATION_MINUTES;
};

export const useInitSiteSettingsStore = create<SiteSettingsStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchSettings: async (slice = 'all', options = {}) => {
      const { force = false } = options;
      const { lastFetched, isLoading, loadedSlices } = get();

      if (!force && isCacheValid(lastFetched) && loadedSlices.has(slice)) {
        return { ok: true };
      }

      if (isLoading) return { ok: false, errorMessage: 'Settings request already in progress.' };

      set({ isLoading: true, lastError: null });

      try {
        const { data, error } = await callApi('ADMIN_GET_SITE_SETTINGS', {
          query: `/${slice}`,
        });

        if (error || !data) {
          const errorMessage = error?.message?.trim() || `Could not load ${slice} settings.`;
          set({ lastError: errorMessage });
          return { ok: false, errorMessage };
        }

        set(state => ({
          settings: {
            ...state.settings,
            ...data,
          },
          loadedSlices: new Set([...state.loadedSlices, slice]),
          lastFetched: new Date(),
          lastError: null,
        }));

        return { ok: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : `Could not load ${slice} settings.`;
        set({ lastError: errorMessage });
        return { ok: false, errorMessage };
      } finally {
        set({ isLoading: false });
      }
    },

    fetchAllSettings: async (options = {}) => {
      const { actions } = get();
      return actions.fetchSettings('all', options);
    },

    setSettings: settings => {
      set({
        settings,
        loadedSlices: new Set(['all']),
        lastFetched: new Date(),
        lastError: null,
      });
    },

    updateSettings: updates => {
      set(state => ({
        settings: {
          ...state.settings,
          ...updates,
        },
      }));
    },

    clearCache: () => {
      set({
        ...initialData,
        loadedSlices: new Set(),
      });
    },

    clearError: () => {
      set({ lastError: null });
    },

    isSliceLoaded: slice => {
      const { loadedSlices, lastFetched } = get();
      return loadedSlices.has(slice) && isCacheValid(lastFetched);
    },
  },
}));

export const useSiteSettingsStore = <T>(selector: SelectorFn<SiteSettingsStore, T>) => {
  const state = useInitSiteSettingsStore(useShallow(selector));
  return state;
};
