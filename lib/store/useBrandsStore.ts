'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientBrand, IBrandsListRes } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export interface BrandsStore {
  // State
  brands: ClientBrand[];
  brandsById: Record<string, ClientBrand>;
  pagination: IBrandsListRes['pagination'] | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchBrands: (options?: { force?: boolean; page?: number; limit?: number }) => Promise<void>;
    getBrandById: (id: string, options?: { force?: boolean }) => Promise<ClientBrand | null>;
    setBrands: (brands: ClientBrand[], pagination?: IBrandsListRes['pagination']) => void;
    updateBrand: (brand: ClientBrand) => void;
    removeBrand: (id: string) => void;
    clearCache: () => void;
  };
}

type InitialBrandsStore = Omit<BrandsStore, 'actions'>;

const initialData: InitialBrandsStore = {
  brands: [],
  brandsById: {},
  pagination: null,
  isLoading: false,
  lastFetched: null,
};

// Cache duration in minutes
const CACHE_DURATION_MINUTES = 5;

const isCacheValid = (lastFetched: Date | null): boolean => {
  if (!lastFetched) return false;
  return differenceInMinutes(new Date(), lastFetched) < CACHE_DURATION_MINUTES;
};

export const useInitBrandsStore = create<BrandsStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchBrands: async (options = {}) => {
      const { force = false, page = 1, limit = 100 } = options;
      const { lastFetched, isLoading } = get();

      // Return early if cache is valid and not forcing refresh
      if (!force && isCacheValid(lastFetched) && get().brands.length > 0) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi('LIST_BRANDS', {
          query: `?page=${page}&limit=${limit}`,
        });

        if (error || !data) {
          console.error('Failed to fetch brands:', error?.message);
          return;
        }

        const { brands, pagination } = data;
        const brandsById = brands.reduce(
          (acc, brand) => {
            acc[brand._id] = brand;
            return acc;
          },
          {} as Record<string, ClientBrand>
        );

        set({
          brands,
          brandsById,
          pagination,
          lastFetched: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    getBrandById: async (id, options = {}) => {
      const { force = false } = options;
      const { brandsById, lastFetched } = get();

      // Return from cache if valid
      if (!force && brandsById[id] && isCacheValid(lastFetched)) {
        return brandsById[id];
      }

      try {
        const { data, error } = await callApi('GET_BRAND', {
          query: `/${id}`,
        });

        if (error || !data) {
          console.error('Failed to fetch brand:', error?.message);
          return null;
        }

        const { brand } = data;

        // Update cache with the fetched brand
        set(state => ({
          brandsById: {
            ...state.brandsById,
            [id]: brand,
          },
          brands: state.brands.some(b => b._id === id)
            ? state.brands.map(b => (b._id === id ? brand : b))
            : [...state.brands, brand],
        }));

        return brand;
      } catch (error) {
        console.error('Failed to fetch brand:', error);
        return null;
      }
    },

    setBrands: (brands, pagination) => {
      const brandsById = brands.reduce(
        (acc, brand) => {
          acc[brand._id] = brand;
          return acc;
        },
        {} as Record<string, ClientBrand>
      );

      set({
        brands,
        brandsById,
        pagination: pagination ?? null,
        lastFetched: new Date(),
      });
    },

    updateBrand: brand => {
      set(state => ({
        brands: state.brands.map(b => (b._id === brand._id ? brand : b)),
        brandsById: {
          ...state.brandsById,
          [brand._id]: brand,
        },
      }));
    },

    removeBrand: id => {
      set(state => ({
        brands: state.brands.filter(b => b._id !== id),
        brandsById: Object.fromEntries(
          Object.entries(state.brandsById).filter(([key]) => key !== id)
        ),
      }));
    },

    clearCache: () => {
      set(initialData);
    },
  },
}));

export const useBrandsStore = <T>(selector: SelectorFn<BrandsStore, T>) => {
  const state = useInitBrandsStore(useShallow(selector));
  return state;
};
