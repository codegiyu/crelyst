import { redirect } from 'next/navigation';
import {
  serverFetchJson,
  ServerFetchError,
  type ServerFetchOptions,
} from '@/app/_server/lib/api/serverFetch';

/**
 * Server-side fetch to /api/admin/* with cookies; redirects to login on 401/403.
 */
export async function fetchAdminJson<T>(
  path: string,
  options: Omit<ServerFetchOptions, 'forwardAuthCookies'> = {}
): Promise<T> {
  try {
    return await serverFetchJson<T>(path, {
      ...options,
      forwardAuthCookies: true,
      revalidate: false,
    });
  } catch (e) {
    if (e instanceof ServerFetchError && (e.status === 401 || e.status === 403)) {
      redirect('/admin/auth/login');
    }
    throw e;
  }
}

/** Same as {@link fetchAdminJson} but returns null on failure (except auth redirects). */
export async function fetchAdminJsonOrNull<T>(
  path: string,
  options: Omit<ServerFetchOptions, 'forwardAuthCookies'> = {}
): Promise<T | null> {
  try {
    return await fetchAdminJson<T>(path, options);
  } catch {
    return null;
  }
}
