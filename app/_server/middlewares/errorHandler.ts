import { AppError } from '../lib/utils/appError';
import { ENVIRONMENT } from '../lib/config/environment';
import { JSON_NO_STORE_HEADERS } from '../lib/utils/httpNoCacheHeaders';
import { logger } from '../lib/utils/logger';
import { NextResponse } from 'next/server';

const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired!', 401);
};

const handleTimeoutError = (): AppError => {
  return new AppError('Request timeout', 408);
};

function errorResponseHeaders(err: AppError): Record<string, string> {
  const base: Record<string, string> = { ...JSON_NO_STORE_HEADERS };
  if (err.statusCode === 429 && err.data != null && typeof err.data === 'object') {
    const sec = (err.data as Record<string, unknown>).retryAfterSec;
    if (typeof sec === 'number' && Number.isFinite(sec)) {
      base['Retry-After'] = String(Math.max(1, Math.floor(sec)));
    }
  }
  return base;
}

const sendErrorDev = (err: AppError) => {
  return NextResponse.json(
    {
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err.data,
      responseCode: err.statusCode,
    },
    { status: err.statusCode, headers: errorResponseHeaders(err) }
  );
};

const sendErrorProd = (err: AppError) => {
  if (err.isOperational) {
    logger.error('Error: ', err);
    return NextResponse.json(
      {
        status: err.status,
        message: err.message,
        error: err.data,
        responseCode: err.statusCode,
      },
      { status: err.statusCode, headers: errorResponseHeaders(err) }
    );
  }
  logger.error('Error: ', err);
  return NextResponse.json(
    {
      responseCode: 500,
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    },
    { status: 500, headers: { ...JSON_NO_STORE_HEADERS } }
  );
};

function normalizeToAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    const code =
      err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : err.statusCode || 500;
    err.statusCode = code;
    err.status = `${code}`.startsWith('5') ? 'Failed' : 'Error';
    return err;
  }

  if (typeof err === 'object' && err !== null) {
    const o = err as Record<string, unknown> & { name?: string };
    if (o.timeout === true) return handleTimeoutError();
    if (o.name === 'JsonWebTokenError') return handleJWTError();
    if (o.name === 'TokenExpiredError') return handleJWTExpiredError();
  }

  if (err instanceof Error) {
    return new AppError(
      err.message || 'Something went wrong. Please try again later.',
      500,
      undefined,
      false
    );
  }

  return new AppError('Something went wrong. Please try again later.', 500, undefined, false);
}

export const errorHandler = (err: unknown): NextResponse => {
  const normalized = normalizeToAppError(err);

  if (ENVIRONMENT.APP.ENV === 'development') {
    if (normalized.statusCode === 500) logger.error(normalized);
    return sendErrorDev(normalized);
  }

  return sendErrorProd(normalized);
};

export function withErrorHandling<TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<Response>
): (...args: TArgs) => Promise<Response> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (e: unknown) {
      return errorHandler(e);
    }
  };
}
