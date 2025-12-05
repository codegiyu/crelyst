import { NextRequest } from 'next/server';
import { withErrorHandling } from './errorHandler';
import { withTimeout } from './timeout';
import { logger } from '../lib/utils/logger';
// import { connectToDatabase } from '../lib/config/db';
import { initializeServer } from '../lib/init';

type Handler = (req: NextRequest) => Promise<Response>;

// Initialize server on module load (runs once per server instance)
// This is safe because initializeServer is idempotent
// initializeServer().catch(error => {
//   logger.error('Failed to initialize server:', error);
// });

export function applyMiddlewares(handler: Handler, options?: { timeoutMs?: number }): Handler {
  return async (req: NextRequest) => {
    logger.info(`[${req.method}] ${req.url}`);

    // Ensure server is initialized (will return immediately if already initialized)
    await initializeServer().catch(error => {
      logger.error('Failed to initialize server:', error);
    });

    // // Ensure database connection (will return cached connection if already connected)
    // await connectToDatabase();

    // Wrap in middleware chain
    const composedHandler = withErrorHandling(withTimeout(handler, options?.timeoutMs));

    // Execute wrapped handler
    return composedHandler(req);
  };
}
