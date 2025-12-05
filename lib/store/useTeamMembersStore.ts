'use client';
import { create } from 'zustand';
import { differenceInMinutes } from 'date-fns';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { ClientTeamMember, ITeamMembersListRes } from '../constants/endpoints';
import { callApi } from '../services/callApi';

export interface TeamMembersStore {
  // State
  teamMembers: ClientTeamMember[];
  teamMembersById: Record<string, ClientTeamMember>;
  pagination: ITeamMembersListRes['pagination'] | null;
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  actions: {
    fetchTeamMembers: (options?: {
      force?: boolean;
      page?: number;
      limit?: number;
    }) => Promise<void>;
    getTeamMemberById: (
      id: string,
      options?: { force?: boolean }
    ) => Promise<ClientTeamMember | null>;
    setTeamMembers: (
      teamMembers: ClientTeamMember[],
      pagination?: ITeamMembersListRes['pagination']
    ) => void;
    updateTeamMember: (teamMember: ClientTeamMember) => void;
    removeTeamMember: (id: string) => void;
    clearCache: () => void;
  };
}

type InitialTeamMembersStore = Omit<TeamMembersStore, 'actions'>;

const initialData: InitialTeamMembersStore = {
  teamMembers: [],
  teamMembersById: {},
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

export const useInitTeamMembersStore = create<TeamMembersStore>()((set, get) => ({
  ...initialData,
  actions: {
    fetchTeamMembers: async (options = {}) => {
      const { force = false, page = 1, limit = 100 } = options;
      const { lastFetched, isLoading } = get();

      // Return early if cache is valid and not forcing refresh
      if (!force && isCacheValid(lastFetched) && get().teamMembers.length > 0) {
        return;
      }

      // Prevent duplicate requests
      if (isLoading) return;

      set({ isLoading: true });

      try {
        const { data, error } = await callApi('LIST_TEAM_MEMBERS', {
          query: `?page=${page}&limit=${limit}`,
        });

        if (error || !data) {
          console.error('Failed to fetch team members:', error?.message);
          return;
        }

        const { teamMembers, pagination } = data;
        const teamMembersById = teamMembers.reduce(
          (acc, teamMember) => {
            acc[teamMember._id] = teamMember;
            return acc;
          },
          {} as Record<string, ClientTeamMember>
        );

        set({
          teamMembers,
          teamMembersById,
          pagination,
          lastFetched: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    getTeamMemberById: async (id, options = {}) => {
      const { force = false } = options;
      const { teamMembersById, lastFetched } = get();

      // Return from cache if valid
      if (!force && teamMembersById[id] && isCacheValid(lastFetched)) {
        return teamMembersById[id];
      }

      try {
        const { data, error } = await callApi('GET_TEAM_MEMBER', {
          query: `/${id}`,
        });

        if (error || !data) {
          console.error('Failed to fetch team member:', error?.message);
          return null;
        }

        const { teamMember } = data;

        // Update cache with the fetched team member
        set(state => ({
          teamMembersById: {
            ...state.teamMembersById,
            [id]: teamMember,
          },
          teamMembers: state.teamMembers.some(t => t._id === id)
            ? state.teamMembers.map(t => (t._id === id ? teamMember : t))
            : [...state.teamMembers, teamMember],
        }));

        return teamMember;
      } catch (error) {
        console.error('Failed to fetch team member:', error);
        return null;
      }
    },

    setTeamMembers: (teamMembers, pagination) => {
      const teamMembersById = teamMembers.reduce(
        (acc, teamMember) => {
          acc[teamMember._id] = teamMember;
          return acc;
        },
        {} as Record<string, ClientTeamMember>
      );

      set({
        teamMembers,
        teamMembersById,
        pagination: pagination ?? null,
        lastFetched: new Date(),
      });
    },

    updateTeamMember: teamMember => {
      set(state => ({
        teamMembers: state.teamMembers.map(t => (t._id === teamMember._id ? teamMember : t)),
        teamMembersById: {
          ...state.teamMembersById,
          [teamMember._id]: teamMember,
        },
      }));
    },

    removeTeamMember: id => {
      set(state => ({
        teamMembers: state.teamMembers.filter(t => t._id !== id),
        teamMembersById: Object.fromEntries(
          Object.entries(state.teamMembersById).filter(([key]) => key !== id)
        ),
      }));
    },

    clearCache: () => {
      set(initialData);
    },
  },
}));

export const useTeamMembersStore = <T>(selector: SelectorFn<TeamMembersStore, T>) => {
  const state = useInitTeamMembersStore(useShallow(selector));
  return state;
};
