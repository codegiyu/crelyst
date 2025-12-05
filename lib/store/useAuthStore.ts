'use client';
import { create } from 'zustand';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { Permission } from '@/app/_server/lib/types/constants';
import type { ClientAdmin } from '../constants/endpoints';
import { callApi } from '../services/callApi';
import { getRouter } from '../utils/navigation';

export interface AuthStore {
  initLoading: boolean;
  loginLoading: boolean;
  pauseNavigatingAwayFromAuth: boolean;
  user: ClientAdmin | null;
  permissions: Permission[];
  actions: {
    setUser: (
      user: ClientAdmin | null,
      options?: {
        permissions?: Permission[];
        initLoading?: boolean;
        pauseNavigatingAwayFromAuth?: boolean;
      }
    ) => void;
    setPermissions: (permissions: Permission[]) => void;
    initSession: () => Promise<void>;
    clearSession: () => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
  };
}

const initialData: Omit<AuthStore, 'actions'> = {
  initLoading: false,
  loginLoading: false,
  pauseNavigatingAwayFromAuth: false,
  user: null,
  permissions: [],
};

export const useInitAuthStore = create<AuthStore>()((set, get) => ({
  ...initialData,
  actions: {
    setUser: (user, options) => {
      const pauseNavigatingAwayFromAuth = options?.pauseNavigatingAwayFromAuth ?? false;
      const permissions = options?.permissions ?? [];
      const initLoading = options?.initLoading ?? false;

      set({
        user,
        ...(permissions.length > 0 ? { permissions } : {}),
        initLoading,
        pauseNavigatingAwayFromAuth,
      });
    },
    setPermissions: permissions => {
      set({ permissions });
    },
    initSession: async () => {
      set({ initLoading: true });
      const { setUser } = get().actions;

      try {
        const { data, error } = await callApi('AUTH_SESSION', {});

        if (error || !data) {
          setUser(null);
          return;
        }

        setUser(data.admin);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        setUser(null, {});
      } finally {
        set({ initLoading: false });
      }
    },
    clearSession: () => {
      set({ ...initialData, initLoading: false });
    },
    login: async (email: string, password: string) => {
      set({ loginLoading: true });
      const { setUser } = get().actions;

      try {
        const { data, error } = await callApi('AUTH_LOGIN', {
          payload: { email, password },
        });

        if (error || !data) {
          return {
            success: false,
            error: error?.message || 'Login failed',
          };
        }

        setUser(data.admin, {
          pauseNavigatingAwayFromAuth: true,
        });

        return { success: true };
      } catch (error) {
        console.error('Login failed:', error);
        return {
          success: false,
          error: 'An unexpected error occurred',
        };
      } finally {
        set({ loginLoading: false });
      }
    },
    logout: async () => {
      const {
        actions: { clearSession },
      } = get();

      try {
        await callApi('AUTH_LOGOUT', {});
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearSession();

        // Redirect to login page
        const router = getRouter();
        if (router) {
          router.replace('/admin/auth/login');
        }
      }
    },
  },
}));

export const useAuthStore = <T>(selector: SelectorFn<AuthStore, T>) => {
  const state = useInitAuthStore(useShallow(selector));
  return state;
};
