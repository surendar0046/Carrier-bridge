import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// In-memory fallback cache when Redis server is offline
const memoryCache = new Map<string, { value: string; expiry: number }>();

let redisClient: Redis | null = null;
let isRedisAvailable = false;

try {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) {
        return null; // Stop retrying to avoid spamming logs
      }
      return Math.min(times * 200, 1000);
    },
    lazyConnect: true,
  });

  redisClient.connect().then(() => {
    isRedisAvailable = true;
    console.log('[Redis] Connected successfully to', redisUrl);
  }).catch((err) => {
    isRedisAvailable = false;
    console.warn('[Redis] Connection offline, using in-memory cache fallback:', err.message);
  });

  redisClient.on('error', (err) => {
    isRedisAvailable = false;
  });

  redisClient.on('ready', () => {
    isRedisAvailable = true;
  });
} catch (err: any) {
  console.warn('[Redis] Init skipped, fallback in-memory cache active:', err.message);
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (isRedisAvailable && redisClient) {
      try {
        return await redisClient.get(key);
      } catch {
        // fallback
      }
    }
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },

  async set(key: string, value: string, ttlSeconds: number = 3600): Promise<void> {
    if (isRedisAvailable && redisClient) {
      try {
        await redisClient.set(key, value, 'EX', ttlSeconds);
        return;
      } catch {
        // fallback
      }
    }
    memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  },

  async del(keyPatternOrPrefix: string): Promise<void> {
    if (isRedisAvailable && redisClient) {
      try {
        const keys = await redisClient.keys(`${keyPatternOrPrefix}*`);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } catch {
        // fallback
      }
    }
    for (const key of memoryCache.keys()) {
      if (key.startsWith(keyPatternOrPrefix)) {
        memoryCache.delete(key);
      }
    }
  },
};
