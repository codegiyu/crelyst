/**
 * Validates request body against a Zod schema in route handlers.
 * Call this first in handlers that expect a JSON body.
 * Returns the parsed body as the schema's type, or throws AppError on validation failure.
 */

import { z } from 'zod';
import { AppError } from '../utils/appError';

export function validateBody<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body);
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

    throw new AppError(message?.trim() ? message.trim() : 'Validation error', 400, errorDetails);
  }
  return result.data as z.infer<T>;
}

/** Shared schema for reorder endpoints: { reorderItems: { id, displayOrder }[] } */
export const reorderBodySchema = z.object({
  reorderItems: z
    .array(
      z.object({
        id: z.string().min(1, 'Each item must have an id'),
        displayOrder: z.number().int().min(0, 'displayOrder must be a non-negative number'),
      })
    )
    .min(1, 'reorderItems array cannot be empty'),
});
