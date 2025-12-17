/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { unprotectedRoutes } from '@/lib/constants/routing';
import { Loader2 } from 'lucide-react';
import { base64UrlDecode } from '@/lib/services/storage';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '';

  const {
    user,
    initLoading,
    pauseNavigatingAwayFromAuth,
    actions: { initSession },
  } = useAuthStore(state => state);

  const [isChecking, setIsChecking] = useState(true);
  const sessionInitializedRef = useRef(false);
  const isProtectedRoute = !unprotectedRoutes.has(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check on unprotected routes
      if (unprotectedRoutes.has(pathname)) {
        setIsChecking(false);
        return;
      }

      // Initialize session only once to prevent duplicate API calls
      if (!sessionInitializedRef.current && !user && !initLoading) {
        sessionInitializedRef.current = true;
        await initSession();
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, user, initLoading]);

  // Handle redirects after auth check
  useEffect(() => {
    if (isChecking || initLoading) return;

    const isProtectedRoute = !unprotectedRoutes.has(pathname);
    const isAuthRoute = pathname.includes('/admin/auth/');

    // If not authenticated and trying to access protected route
    if (!user && isProtectedRoute) {
      router.replace(`/admin/auth/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    // If authenticated and on auth route, redirect to dashboard or redirectTo
    if (user && isAuthRoute && !pauseNavigatingAwayFromAuth) {
      const destination = redirectTo ? base64UrlDecode(redirectTo) : '/admin/dashboard/home';
      router.replace(destination);
      return;
    }
  }, [user, isChecking, initLoading, pathname, router, pauseNavigatingAwayFromAuth, redirectTo]);

  useEffect(() => {
    console.log({ user, isProtectedRoute });
  }, [user, isProtectedRoute]);

  // Show loading spinner while checking auth
  if (isChecking || initLoading) {
    console.log({ isChecking, initLoading });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If on protected route without auth, show loading (redirect is happening)
  if (!user && isProtectedRoute) {
    console.log({ user, isProtectedRoute });
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
