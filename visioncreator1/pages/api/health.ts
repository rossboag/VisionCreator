import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import logger from '@/lib/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const health = {
    uptime: process.uptime(),
    message: 'OK',
    date: new Date(),
    database: false,
    redis: false,
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    health.database = true

    // Check Redis connection
    await redis.ping()
    health.redis = true

    res.status(200).json(health)
  } catch (error) {
    logger.error('Health check failed:', error)
    health.message = 'ERROR'
    res.status(503).json(health)
  }
}

