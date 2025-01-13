import Redis from 'ioredis'
import logger from './logger'

const redis = new Redis(process.env.REDIS_URL)

redis.on('error', (error) => {
  logger.error('Redis connection error:', error)
})

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    logger.error('Redis cache get error:', error)
    return null
  }
}

export async function cacheSet(key: string, value: any, ttl?: number): Promise<void> {
  try {
    const serializedValue = JSON.stringify(value)
    if (ttl) {
      await redis.setex(key, ttl, serializedValue)
    } else {
      await redis.set(key, serializedValue)
    }
  } catch (error) {
    logger.error('Redis cache set error:', error)
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    logger.error('Redis cache delete error:', error)
  }
}

export default redis

