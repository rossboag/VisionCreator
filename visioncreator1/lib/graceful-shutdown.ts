import { Server } from 'http'
import logger from './logger'
import prisma from './prisma'
import redis from './redis'

export function setupGracefulShutdown(server: Server) {
  const shutdown = async () => {
    logger.info('Received kill signal, shutting down gracefully')

    server.close(() => {
      logger.info('Closed out remaining connections')
    })

    try {
      await prisma.$disconnect()
      logger.info('Prisma disconnected')
    } catch (err) {
      logger.error('Error disconnecting Prisma:', err)
    }

    try {
      await redis.quit()
      logger.info('Redis disconnected')
    } catch (err) {
      logger.error('Error disconnecting Redis:', err)
    }

    process.exit(0)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

