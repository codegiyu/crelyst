import { AppError } from '../lib/utils/appError';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function withTimeout<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  ms = 60000 // default: 60 seconds
) {
  return async (...args: Parameters<T>): Promise<Response> => {
    let timer: NodeJS.Timeout | null = null;

    // Create a timeout promise that rejects after `ms`
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Request timed out')), ms);
    });

    try {
      // Race between the handler and timeout
      const response = await Promise.race([handler(...args), timeoutPromise]);
      return response as Response;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      // Equivalent to connect-timeout's behavior
      throw new AppError('Request timed out', 504);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
}
