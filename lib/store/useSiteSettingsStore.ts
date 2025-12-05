'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientSiteSettings } from '../constants/endpoints';
import { callApi } from '../services/callApi';

// Define the available settings slices
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
  | 'contactInfo'
  | 'socials';

export interface SiteSettingsStore {
  // State
  settings: Partial<ClientSiteSettings> | null;
  loadedSlices: Set<SiteSettingsSlice>;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchSettings: (slice?: SiteSettingsSlice, options?: { force?: boolean }) => Promise<void>;
    fetchAllSettings: (options?: { force?: boolean }) => Promise<void>;
    setSettings: (settings: Partial<ClientSiteSettings>) => void;
    updateSettings: (updates: Partial<ClientSiteSettings>) => void;
    clearCache: () => void;
    isSliceLoaded: (slice: SiteSettingsSlice) => boolean;
  };
}

type InitialSiteSettingsStore = Omit<SiteSettingsStore, 'actions'>;

const initialData: InitialSiteSettingsStore = {
  settings: null,
  loadedSlices: new Set(),
  isLoading: false,
  lastFetched: null,
};

// Cache duration in minutes - longer for settings since they change less frequently
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

      // Return early if cache is valid and slice is already loaded
      if (!force && isCacheValid(lastFetched) && loadedSlices.has(slice)) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi('GET_SITE_SETTINGS', {
          query: `/${slice}`,
        });

        if (error || !data) {
          console.error('Failed to fetch site settings:', error?.message);
          return;
        }

        set(state => ({
          settings: {
            ...state.settings,
            ...data,
          },
          loadedSlices: new Set([...state.loadedSlices, slice]),
          lastFetched: new Date(),
        }));
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    fetchAllSettings: async (options = {}) => {
      const { actions } = get();
      await actions.fetchSettings('all', options);
    },

    setSettings: settings => {
      set({
        settings,
        loadedSlices: new Set(['all']),
        lastFetched: new Date(),
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
