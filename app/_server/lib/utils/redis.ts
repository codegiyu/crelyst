import IORedis from 'ioredis';
import { logger } from './logger';
import { ENVIRONMENT } from '../config/environment';
import { monitoringAlert } from './helpers';
import { updateCacheToken } from '../seed';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000; // 3 seconds

let _redisCache: IORedis | null = null;

/**
 * Get or create Redis cache instance (lazy initialization)
 * Validation only happens when Redis is actually accessed, not at module load time
 */
function getRedisCache(): IORedis {
  if (_redisCache) {
    return _redisCache;
  }

  // Validate Redis configuration only when actually needed
  if (!ENVIRONMENT?.REDIS?.CACHE_EXPIRY || !ENVIRONMENT?.REDIS?.URL) {
    const errorMsg =
      'Invalid redis cache configuration. REDIS_URL and CACHE_EXPIRY must be set in environment variables.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  _redisCache = new IORedis(ENVIRONMENT.REDIS.URL, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    offlineQueue: false,
    retryStrategy: times => {
      if (times >= MAX_RETRIES) {
        // Give up after MAX_RETRIES
        logger.error('Unable to connect to Redis after maximum retries');
        return null;
      }
      // Retry after RETRY_DELAY_MS milliseconds
      return RETRY_DELAY_MS;
    },
  });

  _redisCache.on('connect', () => {
    logger.info('Connected to Main Redis cluster');
  });

  _redisCache.on('error', err => {
    logger.error('Redis error', err);
  });

  return _redisCache;
}

// Lazy Redis cache - only initializes when actually accessed
// This prevents build-time errors when Redis config is not available
export const redisCache = new Proxy({} as IORedis, {
  get(_target, prop) {
    const cache = getRedisCache();
    const value = cache[prop as keyof IORedis];
    // If it's a function, bind it to the cache instance
    if (typeof value === 'function') {
      return value.bind(cache);
    }
    return value;
  },
});

export type CacheKey = `queue:${string}` | `vol:${string}` | `pers:${string}`;

export const addToCache = async (
  key: CacheKey,
  value: string | number | object | Buffer,
  expiry?: number
) => {
  if (!key) throw new Error('Invalid key provided');

  if (!value) throw new Error('Invalid value provided');

  return redisCache.set(
    key.toString(),
    JSON.stringify(value),
    'EX',
    expiry || ENVIRONMENT.REDIS.CACHE_EXPIRY
  );
};
export const getFromCache = async <T = string>(key: CacheKey) => {
  if (!key) throw new Error('Invalid key provided');

  const data = await redisCache.get(key.toString());

  if (!data) return null;

  let parseData;
  try {
    parseData = JSON.parse(data);
  } catch (_error) {
    parseData = data;
    logger.error('Error parsing data from cache', _error);
  }

  return parseData as T;
};

export const getFromCacheOrDB = async <T>(
  key: CacheKey,
  dbQuery: () => Promise<T>,
  cacheDuration: number = 3600
): Promise<T> => {
  // Try fetching data from cache
  const cachedData = (await getFromCache(key)) as string;

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch data from the database if not found in cache
  const data = await dbQuery();

  if (!data) {
    throw new Error('Data not found');
  }

  // Store the data in cache for future requests
  await addToCache(key, JSON.stringify(data), cacheDuration);

  return data;
};

export const removeFromCache = async (key: CacheKey) => {
  if (!key) throw new Error('Invalid key provided');

  const data = await redisCache.del(key.toString());

  if (!data) {
    return null;
  }
  return data;
};

/**
 * Delete all keys under a namespace (prefix).
 * Example: await clearNamespace("session:");
 */
export async function clearNamespace(namespace: string) {
  const stream = redisCache.scanStream({
    match: `${namespace}*`,
    count: 100, // fetch 100 keys per batch
  });

  stream.on('data', async (keys: string[]) => {
    if (keys.length) {
      // use UNLINK for async deletion (faster for many keys)
      await redisCache.unlink(...keys);
      logger.debug(`Deleted ${keys.length} keys in ${namespace}`);
    }
  });

  return new Promise<void>((resolve, reject) => {
    stream.on('end', () => resolve());
    stream.on('error', err => reject(err));
  });
}

export const flushCache = async ({
  flushVolatileCache,
  flushPersistentCache,
  flushQueues,
}: {
  flushVolatileCache: boolean;
  flushPersistentCache: boolean;
  flushQueues: boolean;
}) => {
  if (flushVolatileCache) {
    await clearNamespace('vol:');
    monitoringAlert('Volatile Cache flushed');
  }

  if (flushPersistentCache) {
    await clearNamespace('pers:');
    monitoringAlert('Persistent Cache flushed');
  }

  if (flushQueues) {
    await clearNamespace('queue:');
    monitoringAlert('Queue Cache flushed');
  }

  // // send push notifications every 10 seconds
  // await mainQueue.removeJobScheduler('processPushNotifications');
  // const repeatedJob = await mainQueue.upsertJobScheduler(
  //   'processPushNotifications',
  //   {
  //     every: 1000,
  //     immediately: true,
  //   },
  //   {
  //     name: 'processPushNotifications',
  //     data: {
  //       type: 'processPushNotifications',
  //     },
  //   }
  // );
  // logger.info('Push notifications Job added', repeatedJob.id);

  if (ENVIRONMENT.APP.ENV === 'production') {
    await updateCacheToken(); // do not comment out this line
  }

  // return 'cache flushed';
  return 'cache not flushed';
};

/**
 * Disconnect from Redis
 * This should be called when the server is shutting down
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (_redisCache) {
      await _redisCache.quit();
      _redisCache = null;
      logger.info('Redis disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting from Redis:', error);
    // Reset cache even if disconnect fails
    _redisCache = null;
  }
}
