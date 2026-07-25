export type AdminLoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type AdminResourceState<T> = {
  status: AdminLoadStatus;
  data: T | null;
  errorMessage: string | null;
};

export type AdminResourceAction<T> =
  | { type: 'load_start' }
  | { type: 'load_success'; data: T }
  | { type: 'load_error'; message: string }
  | { type: 'reset' };

export function createAdminResourceState<T>(
  initial?: Partial<AdminResourceState<T>>
): AdminResourceState<T> {
  return {
    status: 'idle',
    data: null,
    errorMessage: null,
    ...initial,
  };
}

export function adminResourceReducer<T>(
  state: AdminResourceState<T>,
  action: AdminResourceAction<T>
): AdminResourceState<T> {
  switch (action.type) {
    case 'load_start':
      return {
        ...state,
        status: 'loading',
        errorMessage: null,
      };
    case 'load_success':
      return {
        status: 'success',
        data: action.data,
        errorMessage: null,
      };
    case 'load_error':
      return {
        ...state,
        status: 'error',
        errorMessage: action.message,
      };
    case 'reset':
      return createAdminResourceState<T>();
    default:
      return state;
  }
}

export function resolveAdminResourceErrorMessage(
  apiMessage: string | undefined,
  sectionLabel: string
): string {
  const trimmed = apiMessage?.trim();

  if (trimmed) return trimmed;

  return `Could not load ${sectionLabel}.`;
}
