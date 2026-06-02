'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { unprotectedRoutes, safeAdminRedirectPath } from '@/lib/constants/routing';
import { buildAdminLoginUrl } from '@/lib/auth/adminRoutePaths';
import { AdminAuthLoading } from '@/components/admin/auth/AdminAuthLoading';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';

  const authStatus = useAuthStore(state => state.authStatus);
  const user = useAuthStore(state => state.user);
  const pauseNavigatingAwayFromAuth = useAuthStore(state => state.pauseNavigatingAwayFromAuth);

  const isProtectedRoute = !unprotectedRoutes.has(pathname);
  const isAuthRoute = pathname.includes('/admin/auth/');

  useEffect(() => {
    if (authStatus !== 'ready') return;

    if (!user && isProtectedRoute) {
      router.replace(buildAdminLoginUrl(pathname));
      return;
    }

    if (user && isAuthRoute && !pauseNavigatingAwayFromAuth) {
      router.replace(safeAdminRedirectPath(redirectTo));
    }
  }, [
    authStatus,
    user,
    isProtectedRoute,
    isAuthRoute,
    pathname,
    router,
    pauseNavigatingAwayFromAuth,
    redirectTo,
  ]);

  if (authStatus !== 'ready') {
    return <AdminAuthLoading />;
  }

  if (!user && isProtectedRoute) {
    return <AdminAuthLoading label="Redirecting to sign in…" />;
  }

  return <>{children}</>;
};
