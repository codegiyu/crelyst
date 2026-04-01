import { AppError } from '../../lib/utils/appError';
import type { RouteHandler } from '../../lib/api/routeHandler';

/**
 * Login is handled client-side via Firebase Auth (signInAdmin, signInWithGoogle).
 * This controller is deprecated and returns an error if called.
 */
export const login: RouteHandler = async () => {
  throw new AppError(
    'Use Firebase Auth for login. Call signInAdmin or signInWithGoogle from the client.',
    400
  );
};
