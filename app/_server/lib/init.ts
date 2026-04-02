import { ENVIRONMENT } from '@/lib/config/environment';
import { logger } from './utils/logger';
import { seedFirestore } from './seed/seedFirestore';

interface GlobalInit {
  apiReady?: boolean;
  apiInitializing?: Promise<void>;
}

declare global {
  var serverInit: GlobalInit;
}

const cached = global.serverInit || (global.serverInit = {});

/** Firestore seed on boot: opt-in in production; dev seeds unless SEED_FIRESTORE_ON_BOOT=false. */
export function shouldRunFirestoreSeed(): boolean {
  const flag = ENVIRONMENT.SEED.FIRESTORE_ON_BOOT;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return !ENVIRONMENT.RUNTIME.IS_PRODUCTION;
}

export function resetInitializationCache(): void {
  cached.apiReady = false;
  cached.apiInitializing = undefined;
  logger.info('🔄 Initialization cache reset');
}

export async function cleanupServer(): Promise<void> {
  try {
    logger.info('🧹 Cleaning up server resources...');
    resetInitializationCache();
    logger.info('✅ Server cleanup complete');
  } catch (error) {
    logger.error('❌ Error during server cleanup:', error);
  }
}

/** Firestore seed — safe for every API route / SSR internal fetch. */
export async function initializeApiReadiness(): Promise<void> {
  if (cached.apiReady) return;

  if (cached.apiInitializing) {
    await cached.apiInitializing;
    return;
  }

  cached.apiInitializing = (async () => {
    try {
      if (shouldRunFirestoreSeed()) {
        logger.info('🌱 Seeding Firestore (API readiness)...');
        await seedFirestore();
        logger.info('✅ Firestore seed step complete');
      } else {
        logger.info('⏭️ Skipping Firestore seed (SEED_FIRESTORE_ON_BOOT / production)');
      }
      cached.apiReady = true;
    } catch (error) {
      logger.error('❌ API readiness failed:', error);
      throw error;
    }
  })();

  try {
    await cached.apiInitializing;
  } finally {
    cached.apiInitializing = undefined;
  }
}

/** @deprecated Use initializeApiReadiness only. Queues/Redis were removed. */
export async function ensureWorkerInfrastructure(): Promise<void> {
  await initializeApiReadiness();
}

/** @deprecated Use initializeApiReadiness. */
export async function initializeServer(): Promise<void> {
  await initializeApiReadiness();
}

if (typeof process !== 'undefined') {
  const gracefulShutdown = async (signal: string) => {
    logger.info(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    await cleanupServer();
    process.exit(0);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('uncaughtException', async error => {
    logger.error('💥 Uncaught Exception:', error);
    await cleanupServer();
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason, promise) => {
    logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    if (!ENVIRONMENT.RUNTIME.IS_PRODUCTION) {
      await cleanupServer();
      process.exit(1);
    }
  });
}
