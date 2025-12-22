'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientProject, IProjectsListRes } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export interface ProjectsStore {
  // State
  projects: ClientProject[];
  projectsBySlug: Record<string, ClientProject>;
  pagination: IProjectsListRes['pagination'] | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchProjects: (options?: {
      force?: boolean;
      page?: number;
      limit?: number;
      useAdminEndpoint?: boolean;
    }) => Promise<void>;
    getProjectBySlug: (
      slug: string,
      options?: { force?: boolean; useAdminEndpoint?: boolean }
    ) => Promise<ClientProject | null>;
    setProjects: (projects: ClientProject[], pagination?: IProjectsListRes['pagination']) => void;
    updateProject: (project: ClientProject) => void;
    removeProject: (slug: string) => void;
    clearCache: () => void;
  };
}

type InitialProjectsStore = Omit<ProjectsStore, 'actions'>;

const initialData: InitialProjectsStore = {
  projects: [],
  projectsBySlug: {},
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

export const useInitProjectsStore = create<ProjectsStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchProjects: async (options = {}) => {
      const { force = false, page = 1, limit = 100, useAdminEndpoint = false } = options;
      const { lastFetched, isLoading } = get();

      // Return early if cache is valid and not forcing refresh
      if (!force && isCacheValid(lastFetched) && get().projects.length > 0) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_LIST_PROJECTS' : 'LIST_PROJECTS',
          {
            query: `?page=${page}&limit=${limit}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch projects:', error?.message);
          return;
        }

        const { projects, pagination } = data;
        const projectsBySlug = projects.reduce(
          (acc, project) => {
            acc[project.slug] = project;
            return acc;
          },
          {} as Record<string, ClientProject>
        );

        set({
          projects,
          projectsBySlug,
          pagination,
          lastFetched: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    getProjectBySlug: async (slug, options = {}) => {
      const { force = false, useAdminEndpoint = false } = options;
      const { projectsBySlug, lastFetched } = get();

      // Return from cache if valid
      if (!force && projectsBySlug[slug] && isCacheValid(lastFetched)) {
        return projectsBySlug[slug];
      }

      try {
        const { data, error } = await callApi(
          useAdminEndpoint ? 'ADMIN_GET_PROJECT' : 'GET_PROJECT',
          {
            query: `/${slug}`,
          }
        );

        if (error || !data) {
          console.error('Failed to fetch project:', error?.message);
          return null;
        }

        const { project } = data;

        // Update cache with the fetched project
        set(state => ({
          projectsBySlug: {
            ...state.projectsBySlug,
            [slug]: project,
          },
          projects: state.projects.some(p => p.slug === slug)
            ? state.projects.map(p => (p.slug === slug ? project : p))
            : [...state.projects, project],
        }));

        return project;
      } catch (error) {
        console.error('Failed to fetch project:', error);
        return null;
      }
    },

    setProjects: (projects, pagination) => {
      const projectsBySlug = projects.reduce(
        (acc, project) => {
          acc[project.slug] = project;
          return acc;
        },
        {} as Record<string, ClientProject>
      );

      set({
        projects,
        projectsBySlug,
        pagination: pagination ?? null,
        lastFetched: new Date(),
      });
    },

    updateProject: project => {
      set(state => ({
        projects: state.projects.map(p => (p.slug === project.slug ? project : p)),
        projectsBySlug: {
          ...state.projectsBySlug,
          [project.slug]: project,
        },
      }));
    },

    removeProject: slug => {
      set(state => ({
        projects: state.projects.filter(p => p.slug !== slug),
        projectsBySlug: Object.fromEntries(
          Object.entries(state.projectsBySlug).filter(([key]) => key !== slug)
        ),
      }));
    },

    clearCache: () => {
      set(initialData);
    },
  },
}));

export const useProjectsStore = <T>(selector: SelectorFn<ProjectsStore, T>) => {
  const state = useInitProjectsStore(useShallow(selector));
  return state;
};
