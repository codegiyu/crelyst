import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from './errorHandler';
import { RequestContext } from '../lib/context/withRequestContext';

type CatchAsyncFunction = (reqOrCtx: NextRequest | RequestContext) => Promise<NextResponse>;
export const catchAsync = (fn: CatchAsyncFunction) => {
  return async (reqOrCtx: NextRequest | RequestContext): Promise<NextResponse> => {
    try {
      return await fn(reqOrCtx);
    } catch (err) {
      return errorHandler(err);
    }
  };
};
