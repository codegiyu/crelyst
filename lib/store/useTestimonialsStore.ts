'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientTestimonial, ITestimonialsListRes } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export interface TestimonialsStore {
  // State
  testimonials: ClientTestimonial[];
  testimonialsById: Record<string, ClientTestimonial>;
  pagination: ITestimonialsListRes['pagination'] | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchTestimonials: (options?: {
      force?: boolean;
      page?: number;
      limit?: number;
      useAdminEndpoint?: boolean;
    }) => Promise<void>;
    getTestimonialById: (
      id: string,
      options?: { force?: boolean; useAdminEndpoint?: boolean }
    ) => Promise<ClientTestimonial | null>;
    setTestimonials: (
      testimonials: ClientTestimonial[],
      pagination?: ITestimonialsListRes['pagination']
    ) => void;
    updateTestimonial: (testimonial: ClientTestimonial) => void;
    removeTestimonial: (id: string) => void;
    clearCache: () => void;
  };
}

type InitialTestimonialsStore = Omit<TestimonialsStore, 'actions'>;

const initialData: InitialTestimonialsStore = {
  testimonials: [],
  testimonialsById: {},
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

export const useInitTestimonialsStore = create<TestimonialsStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchTestimonials: async (options = {}) => {
      const { force = false, page = 1, limit = 100, useAdminEndpoint = false } = options;
      const { lastFetched, isLoading } = get();

      // Return early if cache is valid and not forcing refresh
      if (!force && isCacheValid(lastFetched) && get().testimonials.length > 0) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_LIST_TESTIMONIALS' : 'LIST_TESTIMONIALS',
          {
            query: `?page=${page}&limit=${limit}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch testimonials:', error?.message);
          return;
        }

        const { testimonials, pagination } = data;
        const testimonialsById = testimonials.reduce(
          (acc, testimonial) => {
            acc[testimonial._id] = testimonial;
            return acc;
          },
          {} as Record<string, ClientTestimonial>
        );

        set({
          testimonials,
          testimonialsById,
          pagination,
          lastFetched: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    getTestimonialById: async (id, options = {}) => {
      const { force = false, useAdminEndpoint = false } = options;
      const { testimonialsById, lastFetched } = get();

      // Return from cache if valid
      if (!force && testimonialsById[id] && isCacheValid(lastFetched)) {
        return testimonialsById[id];
      }

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_GET_TESTIMONIAL' : 'GET_TESTIMONIAL',
          {
            query: `/${id}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch testimonial:', error?.message);
          return null;
        }

        const { testimonial } = data;

        // Update cache with the fetched testimonial
        set(state => ({
          testimonialsById: {
            ...state.testimonialsById,
            [id]: testimonial,
          },
          testimonials: state.testimonials.some(t => t._id === id)
            ? state.testimonials.map(t => (t._id === id ? testimonial : t))
            : [...state.testimonials, testimonial],
        }));

        return testimonial;
      } catch (error) {
        console.error('Failed to fetch testimonial:', error);
        return null;
      }
    },

    setTestimonials: (testimonials, pagination) => {
      const testimonialsById = testimonials.reduce(
        (acc, testimonial) => {
          acc[testimonial._id] = testimonial;
          return acc;
        },
        {} as Record<string, ClientTestimonial>
      );

      set({
        testimonials,
        testimonialsById,
        pagination: pagination ?? null,
        lastFetched: new Date(),
      });
    },

    updateTestimonial: testimonial => {
      set(state => ({
        testimonials: state.testimonials.map(t => (t._id === testimonial._id ? testimonial : t)),
        testimonialsById: {
          ...state.testimonialsById,
          [testimonial._id]: testimonial,
        },
      }));
    },

    removeTestimonial: id => {
      set(state => ({
        testimonials: state.testimonials.filter(t => t._id !== id),
        testimonialsById: Object.fromEntries(
          Object.entries(state.testimonialsById).filter(([key]) => key !== id)
        ),
      }));
    },

    clearCache: () => {
      set(initialData);
    },
  },
}));

export const useTestimonialsStore = <T>(selector: SelectorFn<TestimonialsStore, T>) => {
  const state = useInitTestimonialsStore(useShallow(selector));
  return state;
};
