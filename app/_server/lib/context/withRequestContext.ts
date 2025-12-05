/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import { RequestBody, validateRequest } from '../../middlewares/validateRequest';
import { ACCESS_TYPES } from '../types/constants';
import { protectRoutes } from '../../middlewares/protectRoutes';

export type RequestContext = {
  req: NextRequest;
  user?: any;
  body: RequestBody;
};

export function withRequestContext({
  protect = false,
  accessType = 'client',
}: {
  accessType?: ACCESS_TYPES;
  protect?: boolean;
}) {
  return function <T extends (ctx: RequestContext) => Promise<Response>>(fn: T) {
    return async (req: NextRequest): Promise<Response> => {
      let user: any = null;
      if (protect) {
        user = await protectRoutes(accessType)(req);
      }

      const body = await validateRequest(req);

      return fn({ req, user, body });
    };
  };
}
