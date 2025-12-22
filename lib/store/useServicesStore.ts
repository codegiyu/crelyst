'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientService, IServicesListRes } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export interface ServicesStore {
  // State
  services: ClientService[];
  servicesBySlug: Record<string, ClientService>;
  pagination: IServicesListRes['pagination'] | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchServices: (options?: {
      force?: boolean;
      page?: number;
      limit?: number;
      useAdminEndpoint?: boolean;
    }) => Promise<void>;
    getServiceBySlug: (
      slug: string,
      options?: { force?: boolean; useAdminEndpoint?: boolean }
    ) => Promise<ClientService | null>;
    setServices: (services: ClientService[], pagination?: IServicesListRes['pagination']) => void;
    updateService: (service: ClientService) => void;
    removeService: (slug: string) => void;
    clearCache: () => void;
  };
}

type InitialServicesStore = Omit<ServicesStore, 'actions'>;

const initialData: InitialServicesStore = {
  services: [],
  servicesBySlug: {},
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

export const useInitServicesStore = create<ServicesStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchServices: async (options = {}) => {
      const { force = false, page = 1, limit = 100, useAdminEndpoint = false } = options;
      const { lastFetched, isLoading } = get();

      // Return early if cache is valid and not forcing refresh
      if (!force && isCacheValid(lastFetched) && get().services.length > 0) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_LIST_SERVICES' : 'LIST_SERVICES',
          {
            query: `?page=${page}&limit=${limit}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch services:', error?.message);
          return;
        }

        const { services, pagination } = data;
        const servicesBySlug = services.reduce(
          (acc, service) => {
            acc[service.slug] = service;
            return acc;
          },
          {} as Record<string, ClientService>
        );

        set({
          services,
          servicesBySlug,
          pagination,
          lastFetched: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    getServiceBySlug: async (slug, options = {}) => {
      const { force = false, useAdminEndpoint = false } = options;
      const { servicesBySlug, lastFetched } = get();

      // Return from cache if valid
      if (!force && servicesBySlug[slug] && isCacheValid(lastFetched)) {
        return servicesBySlug[slug];
      }

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_GET_SERVICE' : 'GET_SERVICE',
          {
            query: `/${slug}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch service:', error?.message);
          return null;
        }

        const { service } = data;

        // Update cache with the fetched service
        set(state => ({
          servicesBySlug: {
            ...state.servicesBySlug,
            [slug]: service,
          },
          services: state.services.some(s => s.slug === slug)
            ? state.services.map(s => (s.slug === slug ? service : s))
            : [...state.services, service],
        }));

        return service;
      } catch (error) {
        console.error('Failed to fetch service:', error);
        return null;
      }
    },

    setServices: (services, pagination) => {
      const servicesBySlug = services.reduce(
        (acc, service) => {
          acc[service.slug] = service;
          return acc;
        },
        {} as Record<string, ClientService>
      );

      set({
        services,
        servicesBySlug,
        pagination: pagination ?? null,
        lastFetched: new Date(),
      });
    },

    updateService: service => {
      set(state => ({
        services: state.services.map(s => (s.slug === service.slug ? service : s)),
        servicesBySlug: {
          ...state.servicesBySlug,
          [service.slug]: service,
        },
      }));
    },

    removeService: slug => {
      set(state => ({
        services: state.services.filter(s => s.slug !== slug),
        servicesBySlug: Object.fromEntries(
          Object.entries(state.servicesBySlug).filter(([key]) => key !== slug)
        ),
      }));
    },

    clearCache: () => {
      set(initialData);
    },
  },
}));

export const useServicesStore = <T>(selector: SelectorFn<ServicesStore, T>) => {
  const state = useInitServicesStore(useShallow(selector));
  return state;
};
