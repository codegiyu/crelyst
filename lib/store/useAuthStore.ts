'use client';
import { create } from 'zustand';
import type { SelectorFn } from '../types/general';
import { useShallow } from 'zustand/react/shallow';
import type { Permission } from '@/app/_server/lib/types/constants';
import type { ClientAdmin } from '../constants/endpoints';
import { signInAdmin, signOutUser } from '@/lib/firebase/auth';
import { getRouter } from '../utils/navigation';
import { clearAdminSessionCookie, syncAdminSessionCookie } from '@/lib/auth/adminSessionCookie';

const SESSION_URL = '/api/admin/auth/session';

export type AuthStatus = 'idle' | 'hydrating' | 'ready';

export interface AuthStore {
  authStatus: AuthStatus;
  loginLoading: boolean;
  pauseNavigatingAwayFromAuth: boolean;
  user: ClientAdmin | null;
  permissions: Permission[];
  actions: {
    setUser: (
      user: ClientAdmin | null,
      options?: {
        permissions?: Permission[];
        pauseNavigatingAwayFromAuth?: boolean;
      }
    ) => void;
    setAuthStatus: (status: AuthStatus) => void;
    setPermissions: (permissions: Permission[]) => void;
    clearSession: () => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
  };
}

const initialData: Omit<AuthStore, 'actions'> = {
  authStatus: 'hydrating',
  loginLoading: false,
  pauseNavigatingAwayFromAuth: false,
  user: null,
  permissions: [],
};

async function fetchSessionWithToken(idToken: string): Promise<ClientAdmin | null> {
  const res = await fetch(SESSION_URL, {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${idToken}` },
  });
  const json = await res.json();
  const admin = json?.data?.admin ?? json?.admin ?? null;
  return admin && (admin.id || admin._id) ? admin : null;
}

export const useInitAuthStore = create<AuthStore>()((set, get) => ({
  ...initialData,
  actions: {
    setUser: (user, options) => {
      const pauseNavigatingAwayFromAuth = options?.pauseNavigatingAwayFromAuth ?? false;
      const permissions = options?.permissions ?? [];

      set({
        user,
        ...(permissions.length > 0 ? { permissions } : {}),
        pauseNavigatingAwayFromAuth,
      });
    },
    setAuthStatus: status => {
      set({ authStatus: status });
    },
    setPermissions: permissions => {
      set({ permissions });
    },
    clearSession: () => {
      set({ ...initialData, authStatus: 'ready' });
    },
    login: async (email: string, password: string) => {
      set({ loginLoading: true });
      const { setUser } = get().actions;

      try {
        const userCredential = await signInAdmin(email, password);
        const idToken = await userCredential.user.getIdToken();
        const admin = await fetchSessionWithToken(idToken);

        if (!admin) {
          await signOutUser();
          return {
            success: false,
            error: 'Access denied. Admin privileges required.',
          };
        }

        await syncAdminSessionCookie(idToken);
        setUser(admin, { pauseNavigatingAwayFromAuth: true });
        return { success: true };
      } catch (error: unknown) {
        const err = error as { message?: string; code?: string };
        const message =
          err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
            ? 'Invalid email or password'
            : err.message || 'Login failed';
        return { success: false, error: message };
      } finally {
        set({ loginLoading: false });
      }
    },
    logout: async () => {
      const { clearSession } = get().actions;
      try {
        await clearAdminSessionCookie();
        await signOutUser();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        clearSession();
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
