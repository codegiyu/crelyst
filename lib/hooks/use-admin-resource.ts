'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { callApi } from '@/lib/services/callApi';
import type { AllEndpoints } from '@/lib/constants/endpoints';
import {
  adminResourceReducer,
  createAdminResourceState,
  resolveAdminResourceErrorMessage,
  type AdminResourceState,
} from '@/lib/admin/adminResourceState';

type EndpointCallOptions<T extends keyof AllEndpoints> = Omit<AllEndpoints[T], 'response'>;

type UseAdminResourceOptions<T extends keyof AllEndpoints> = {
  /** Stable cache / future TanStack Query key, e.g. ['admin', 'services', { limit: 100 }] */
  resourceKey: readonly unknown[];
  endpoint: T;
  /** callApi options (query/payload). Include values in resourceKey when they change. */
  options?: EndpointCallOptions<T>;
  sectionLabel: string;
  /** When false, skip the initial load (default true) */
  enabled?: boolean;
};

export type UseAdminResourceResult<TData> = AdminResourceState<TData> & {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  reload: () => Promise<void>;
};

/**
 * Client-owned admin resource loader via callApi → /api/admin/*.
 * Designed so a later TanStack Query swap can reuse resourceKey + loader shape.
 */
export function useAdminResource<T extends keyof AllEndpoints>({
  resourceKey,
  endpoint,
  options,
  sectionLabel,
  enabled = true,
}: UseAdminResourceOptions<T>): UseAdminResourceResult<AllEndpoints[T]['response']> {
  type TData = AllEndpoints[T]['response'];

  const [state, dispatch] = useReducer(adminResourceReducer<TData>, undefined, () =>
    createAdminResourceState<TData>()
  );

  const requestIdRef = useRef(0);
  const loadIdentity = `${JSON.stringify(resourceKey)}::${JSON.stringify(options ?? null)}`;

  const reload = useCallback(async () => {
    if (!enabled) return;

    const requestId = ++requestIdRef.current;
    dispatch({ type: 'load_start' });

    const optionsJson = loadIdentity.slice(loadIdentity.indexOf('::') + 2);
    const callOptions = (
      optionsJson === 'null' ? {} : (JSON.parse(optionsJson) as EndpointCallOptions<T>)
    ) as EndpointCallOptions<T>;

    const { data, error } = await callApi(endpoint, callOptions);

    if (requestId !== requestIdRef.current) return;

    if (error || data === undefined) {
      dispatch({
        type: 'load_error',
        message: resolveAdminResourceErrorMessage(error?.message, sectionLabel),
      });
      return;
    }

    dispatch({ type: 'load_success', data });
  }, [enabled, endpoint, sectionLabel, loadIdentity]);

  useEffect(() => {
    if (!enabled) return;

    void reload();
  }, [enabled, reload]);

  return {
    ...state,
    isLoading: enabled && (state.status === 'loading' || state.status === 'idle'),
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    reload,
  };
}
