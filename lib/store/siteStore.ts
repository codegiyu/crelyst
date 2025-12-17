import { create } from 'zustand';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';

export interface SiteStore {
  siteLoading: boolean;
  actions: {
    setSiteLoading: (val: boolean) => void;
  };
}
type InitialSiteStore = Omit<SiteStore, 'actions'>;
export type SiteStoreKey = keyof InitialSiteStore;

const initialData: InitialSiteStore = {
  siteLoading: true,
};

export const useInitSiteStore = create<SiteStore>()(set => ({
  ...initialData,
  actions: {
    setSiteLoading: siteLoading => {
      set({ siteLoading });
    },
  },
}));

export const useSiteStore = <T>(selector: SelectorFn<SiteStore, T>) => {
  const state = useInitSiteStore(useShallow(selector));
  return state;
};
