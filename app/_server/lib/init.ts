import { logger } from './utils/logger';
import { connectToDatabase, disconnectDatabase } from './config/db';
import { seedDb } from './seed';
import { startQueues, stopQueues } from '../queues';
import { disconnectRedis } from './utils/redis';

/**
 * Global flag to ensure initialization only runs once
 */
interface GlobalInit {
  initialized?: boolean;
  initializing?: Promise<void>;
}

declare global {
  var serverInit: GlobalInit;
}

const cached = global.serverInit || (global.serverInit = {});

/**
 * Reset the initialization cache
 * This is useful when the server is restarted and we want to re-initialize
 */
export function resetInitializationCache(): void {
  cached.initialized = false;
  cached.initializing = undefined;
  logger.info('🔄 Initialization cache reset');
}

/**
 * Cleanup server resources (database, redis, queues, etc.)
 * This should be called when the server is shutting down
 */
export async function cleanupServer(): Promise<void> {
  try {
    logger.info('🧹 Cleaning up server resources...');

    // 1. Stop queues and workers
    try {
      await stopQueues();
      logger.info('✅ Queues and workers stopped');
    } catch (error) {
      logger.error('Error stopping queues:', error);
    }

    // 2. Disconnect Redis
    try {
      await disconnectRedis();
      logger.info('✅ Redis disconnected');
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
    }

    // 3. Disconnect database
    try {
      await disconnectDatabase();
      logger.info('✅ Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting database:', error);
    }

    // 4. Reset initialization cache
    resetInitializationCache();

    logger.info('✅ Server cleanup complete');
  } catch (error) {
    logger.error('❌ Error during server cleanup:', error);
  }
}

/**
 * Check if server resources are still connected
 * Returns true if all resources are healthy, false otherwise
 */
async function checkServerHealth(): Promise<boolean> {
  try {
    // Check database connection
    const mongoose = await import('mongoose');
    if (mongoose.default.connection.readyState !== 1) {
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      logger.warn('⚠️ Database connection is not healthy');
      return false;
    }

    // Check Redis connection (if it exists)
    try {
      const { redisCache } = await import('./utils/redis');
      const status = redisCache.status;
      if (status !== 'ready' && status !== 'connect') {
        logger.warn('⚠️ Redis connection is not healthy');
        return false;
      }
    } catch (error) {
      // Redis might not be initialized yet, which is okay
      logger.debug('Redis not yet initialized');
      logger.debug(error);
    }

    return true;
  } catch (error) {
    logger.warn('⚠️ Error checking server health:', error);
    return false;
  }
}

/**
 * Initialize server resources (database, queues, cron jobs, etc.)
 * This function is idempotent and will only run once per server instance
 * It will also re-initialize if connections are lost
 */
export async function initializeServer(): Promise<void> {
  // If already initialized, check if connections are still healthy
  if (cached.initialized) {
    const isHealthy = await checkServerHealth();
    if (isHealthy) {
      return; // Everything is fine, skip initialization
    } else {
      // Connections are dead, reset and re-initialize
      logger.warn('⚠️ Server connections lost, re-initializing...');
      resetInitializationCache();
    }
  }

  // If initialization is in progress, wait for it
  if (cached.initializing) {
    logger.info('🔄 Server is already initializing...');
    await cached.initializing;
    return;
  }

  // Start initialization
  cached.initializing = (async () => {
    try {
      logger.info('🚀 Initializing server...');

      // 1. Connect to database
      logger.info('📦 Connecting to database...');
      await connectToDatabase();
      logger.info('✅ Database connected');

      // 2. Seed database (only runs once due to upsert logic in seed functions)
      logger.info('🌱 Seeding database...');
      await seedDb();
      logger.info('✅ Database seeded');

      // 3. Start queues and workers
      logger.info('📬 Starting queues and workers...');
      await startQueues();
      logger.info('✅ Queues and workers started');

      // 4. Start cron jobs (if any)
      // TODO: Add cron job initialization here when implemented
      // await startCronJobs();
      // logger.info('✅ Cron jobs started');

      cached.initialized = true;
      logger.info('🎉 Server initialization complete');
    } catch (error) {
      logger.error('❌ Server initialization failed:', error);
      cached.initializing = undefined; // Allow retry on next call
      throw error;
    }
  })();

  await cached.initializing;
}

// Set up process event listeners for graceful shutdown
if (typeof process !== 'undefined') {
  // Handle graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    logger.info(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    await cleanupServer();
    process.exit(0);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', async error => {
    logger.error('💥 Uncaught Exception:', error);
    await cleanupServer();
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    await cleanupServer();
    process.exit(1);
  });
}
