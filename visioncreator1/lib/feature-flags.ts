import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.on('error', (err) => console.log('Redis Client Error', err))

export async function isFeatureEnabled(featureName: string, userId?: string): Promise<boolean> {
  await redisClient.connect()

  try {
    const featureFlag = await redisClient.get(`feature:${featureName}`)
    
    if (!featureFlag) {
      return false
    }

    const flagData = JSON.parse(featureFlag)

    if (flagData.enabled === false) {
      return false
    }

    if (flagData.percentage) {
      const userHash = userId ? hashCode(userId) : Math.random()
      return (userHash % 100) < flagData.percentage
    }

    return true
  } finally {
    await redisClient.disconnect()
  }
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export async function setFeatureFlag(featureName: string, enabled: boolean, percentage?: number): Promise<void> {
  await redisClient.connect()

  try {
    await redisClient.set(`feature:${featureName}`, JSON.stringify({ enabled, percentage }))
  } finally {
    await redisClient.disconnect()
  }
}

