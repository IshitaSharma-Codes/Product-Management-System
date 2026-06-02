const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient = null;
let isRedisConnected = false;

if (process.env.REDIS_ENABLED === 'true') {
  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redisPort = process.env.REDIS_PORT || 6379;
  const redisPassword = process.env.REDIS_PASSWORD || undefined;

  logger.info(`Attempting Redis connection at ${redisHost}:${redisPort}`);
  
  redisClient = new Redis({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) {
        logger.warn('Redis connection failed. Continuing without Redis cache.');
        isRedisConnected = false;
        return null; // stop retrying
      }
      return Math.min(times * 100, 2000);
    }
  });

  redisClient.on('connect', () => {
    logger.info('Redis connection initiating...');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client connected and ready.');
    isRedisConnected = true;
  });

  redisClient.on('error', (err) => {
    logger.error('Redis Error: %s', err.message);
    isRedisConnected = false;
  });

  redisClient.on('end', () => {
    logger.warn('Redis connection ended.');
    isRedisConnected = false;
  });
} else {
  logger.info('Redis caching is disabled in configurations.');
}

const getCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis GET Error for key %s: %s', key, error.message);
    return null;
  }
};

const setCache = async (key, value, expireInSeconds = 300) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', expireInSeconds);
    return true;
  } catch (error) {
    logger.error('Redis SET Error for key %s: %s', key, error.message);
    return false;
  }
};

const deleteCache = async (keyPattern) => {
  if (!isRedisConnected || !redisClient) return false;
  try {
    if (keyPattern.endsWith('*')) {
      const keys = await redisClient.keys(keyPattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } else {
      await redisClient.del(keyPattern);
    }
    return true;
  } catch (error) {
    logger.error('Redis DEL Error for pattern %s: %s', keyPattern, error.message);
    return false;
  }
};

module.exports = {
  redisClient,
  isRedisActive: () => isRedisConnected,
  getCache,
  setCache,
  deleteCache
};
