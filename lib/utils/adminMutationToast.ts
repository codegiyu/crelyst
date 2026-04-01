import { toast } from 'sonner';
import type { AllEndpoints } from '@/lib/constants/endpoints';
import type { ResponseMessage } from '@/lib/types/http';

/**
 * Runs an async function with Sonner: loading toast (spinner) until settle, then success or error.
 * Returns the result, or `undefined` if the mutation failed (error toast already shown).
 */
export async function adminMutationToast<T>(
  loadingMessage: string,
  mutate: () => Promise<T>,
  successMessage: (result: T) => string
): Promise<T | undefined> {
  const promise = mutate();
  try {
    await toast.promise(promise, {
      loading: loadingMessage,
      success: successMessage,
      error: err => (err instanceof Error ? err.message : 'Something went wrong'),
    });
    return await promise;
  } catch {
    return undefined;
  }
}

/**
 * Same as {@link adminMutationToast} for `callApi` responses: throws internally on `type === 'error'`.
 * `successMessage` may be a string or a function of the response `data` payload.
 */
export async function adminCallApiToast<E extends keyof AllEndpoints>(
  loadingMessage: string,
  call: () => Promise<ResponseMessage<E>>,
  successMessage: string | ((data: AllEndpoints[E]['response']) => string)
): Promise<AllEndpoints[E]['response'] | undefined> {
  return adminMutationToast(
    loadingMessage,
    async () => {
      const res = await call();
      if (res.type === 'error') {
        throw new Error(res.message || 'Request failed');
      }
      return res.data;
    },
    data => (typeof successMessage === 'function' ? successMessage(data) : successMessage)
  );
}
