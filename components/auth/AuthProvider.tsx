/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useInitAuthStore } from '@/lib/store/useAuthStore';
import { clearAdminSessionCookie, syncAdminSessionCookie } from '@/lib/auth/adminSessionCookie';

const SESSION_URL = '/api/admin/auth/session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useInitAuthStore(state => state.actions.setUser);
  const clearSession = useInitAuthStore(state => state.actions.clearSession);
  const setAuthStatus = useInitAuthStore(state => state.actions.setAuthStatus);

  useEffect(() => {
    if (!auth) {
      setAuthStatus('ready');
      return;
    }

    setAuthStatus('hydrating');

    const unsubscribeToken = onIdTokenChanged(auth, async user => {
      if (!user) return;
      const idToken = await user.getIdToken();
      await syncAdminSessionCookie(idToken);
    });

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          const res = await fetch(SESSION_URL, {
            method: 'GET',
            credentials: 'include',
            headers: { Authorization: `Bearer ${idToken}` },
          });
          const data = await res.json();
          const admin = data?.data?.admin ?? data?.admin ?? null;
          setUser(admin);
          if (admin) {
            await syncAdminSessionCookie(idToken);
          }
        } else {
          await clearAdminSessionCookie();
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        setAuthStatus('ready');
      }
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    };
  }, []);

  return <>{children}</>;
}
