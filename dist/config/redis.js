"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// In-memory fallback cache when Redis server is offline
const memoryCache = new Map();
let redisClient = null;
let isRedisAvailable = false;
try {
    redisClient = new ioredis_1.default(redisUrl, {
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
}
catch (err) {
    console.warn('[Redis] Init skipped, fallback in-memory cache active:', err.message);
}
exports.cache = {
    async get(key) {
        if (isRedisAvailable && redisClient) {
            try {
                return await redisClient.get(key);
            }
            catch {
                // fallback
            }
        }
        const item = memoryCache.get(key);
        if (!item)
            return null;
        if (Date.now() > item.expiry) {
            memoryCache.delete(key);
            return null;
        }
        return item.value;
    },
    async set(key, value, ttlSeconds = 3600) {
        if (isRedisAvailable && redisClient) {
            try {
                await redisClient.set(key, value, 'EX', ttlSeconds);
                return;
            }
            catch {
                // fallback
            }
        }
        memoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
    },
    async del(keyPatternOrPrefix) {
        if (isRedisAvailable && redisClient) {
            try {
                const keys = await redisClient.keys(`${keyPatternOrPrefix}*`);
                if (keys.length > 0) {
                    await redisClient.del(...keys);
                }
            }
            catch {
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
