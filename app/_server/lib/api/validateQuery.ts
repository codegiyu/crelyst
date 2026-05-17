import { z } from 'zod';
import { AppError } from '../utils/appError';

export function validateQuery<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams
): z.infer<T> {
  const raw = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(raw);

  if (!result.success) {
    const errorDetails = z.flattenError(result.error).fieldErrors as Record<
      string,
      string[] | undefined
    >;

    let message = '';
    Object.keys(errorDetails).forEach(key => {
      const error = errorDetails?.[key];
      const errorMessage = error?.[0];
      message += errorMessage ? ` ${errorMessage}` : '';
    });

    throw new AppError(
      message?.trim() ? message.trim() : 'Invalid query parameters',
      400,
      errorDetails
    );
  }

  return result.data as z.infer<T>;
}
