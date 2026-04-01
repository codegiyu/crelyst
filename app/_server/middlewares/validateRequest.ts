/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { partialMainSchema } from '../lib/validation/main';
import { AppError } from '../lib/utils/appError';
import { NextRequest } from 'next/server';

const methodsToSkipValidation = ['GET'];
const routesToSkipValidation: string[] = [];

const validateData = (data: any, schema: z.ZodSchema, _url: string) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorDetails = z.flattenError(result.error).fieldErrors as Record<
      string,
      string[] | undefined
    >;

    let message = '';

    Object.keys(errorDetails).forEach(key => {
      const error = errorDetails?.[key];
      const errorMessage = error?.[0];
      message += ` ${errorMessage}`;
    });

    throw new AppError(
      message?.includes('format') ? message : 'Validation error!',
      400,
      errorDetails
    );
  }
  return result.data;
};

export type RequestBody = Record<string, any>;

/** Parse and validate request body. Throws on validation error. */
export async function parseBody(request: NextRequest): Promise<RequestBody> {
  let body: RequestBody = {};

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      body = await request.json();
    } catch {
      body = {};
    }
  }

  if (request.url.includes('/webhook') || request.url.includes('/api/public/')) return body;

  if (
    methodsToSkipValidation.includes(request.method) ||
    routesToSkipValidation.includes(request.url)
  )
    return body;

  if (body && Object.keys(body).length > 0) {
    body = validateData(body, partialMainSchema, request.url) as RequestBody;
    if (body?.email) body.email = body.email.toLowerCase().trim();
  }

  return body;
}
