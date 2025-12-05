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

export const validateRequest = async (req: NextRequest): Promise<RequestBody> => {
  let body: RequestBody = {};

  // ✅ Parse body safely if the request has one
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.json(); // Parses JSON body
    } catch {
      body = {}; // If no valid JSON body
    }
  }

  // Skip validation for defined methods and routes
  if (req.url.includes('/webhook')) return body;

  if (methodsToSkipValidation.includes(req.method) || routesToSkipValidation.includes(req.url))
    return body;

  if (body) {
    body = validateData(body, partialMainSchema, req?.url) as any;

    if (body?.email) body.email = body.email.toLowerCase().trim();
  }

  return body;
};
