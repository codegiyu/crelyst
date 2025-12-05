/* eslint-disable @typescript-eslint/no-explicit-any */

import { Error as MongooseError, type CastError } from 'mongoose';
import { AppError } from '../lib/utils/appError';
import { ENVIRONMENT } from '../lib/config/environment';
import { logger } from '../lib/utils/logger';
import { NextResponse } from 'next/server';

// Error handling functions
const handleMongooseCastError = (err: CastError): AppError => {
  const message = `Invalid ${err.path} value "${err.value}".`;
  return new AppError(message, 400);
};

const handleMongooseValidationError = (err: MongooseError.ValidationError): AppError => {
  const errors = Object.values(err.errors).map(el => (el as any).message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired!', 401);
};

const handleTimeoutError = (): AppError => {
  return new AppError('Request timeout', 408);
};

const handleMongooseGenericError = (
  err: MongooseError & { code?: number; keyValue?: { [key: string]: any } }
): AppError => {
  if (err.code === 11000) {
    const field = (Object.keys(err.keyValue ?? {})?.[0] ?? '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(/(?=[A-Z])/)
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toLowerCase()
      )
      .join('');

    const value = (err.keyValue ?? {})[field.toLowerCase()];
    const message = `${field} "${value}" has already been used!.`;
    return new AppError(message, 409);
  } else {
    console.log(err);
    return new AppError('MSE: An error occurred, please contact support', 500);
  }
};

const sendErrorDev = (err: AppError) => {
  return NextResponse.json(
    {
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err.data,
      responseCode: err.statusCode,
    },
    { status: err.statusCode }
  );
};

const sendErrorProd = (err: AppError) => {
  if (err?.isOperational) {
    logger.error('Error: ', err);
    return NextResponse.json(
      {
        status: err.status,
        message: err.message,
        error: err.data,
        responseCode: err.statusCode,
      },
      { status: err.statusCode }
    );
  } else {
    console.error('Error: ', err);
    return NextResponse.json(
      {
        responseCode: 500,
        status: 'ISR: Error',
        message: `😔 You didn't break it, we did!, Our team is on it!`,
      },
      { status: 500 }
    );
  }
};

export const errorHandler = (err: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';

  if (ENVIRONMENT.APP.ENV === 'development') {
    if (err.statusCode === 500) logger.error(err);

    return sendErrorDev(err);
  } else {
    let error = err;

    if (err instanceof MongooseError.CastError) error = handleMongooseCastError(err);
    else if (err instanceof MongooseError.ValidationError)
      error = handleMongooseValidationError(err);
    if ('timeout' in err && err.timeout) error = handleTimeoutError();
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err instanceof MongooseError) error = handleMongooseGenericError(err);

    return sendErrorProd(error);
  }
};

export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(handler: T) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (err: any) {
      return errorHandler(err);
    }
  };
}
