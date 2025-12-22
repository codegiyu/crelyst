import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from './errorHandler';
import { RequestContext } from '../lib/context/withRequestContext';
import { RequestBody } from './validateRequest';

type CatchAsyncFunction = (
  reqOrCtx: NextRequest | RequestContext
) => Promise<NextResponse | RequestBody>;
export const catchAsync = (fn: CatchAsyncFunction) => {
  return async (reqOrCtx: NextRequest | RequestContext): Promise<NextResponse> => {
    try {
      return (await fn(reqOrCtx)) as NextResponse;
    } catch (err) {
      return errorHandler(err);
    }
  };
};
