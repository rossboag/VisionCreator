import { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import logger from '@/lib/logger'

export default function errorHandler(
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  logger.error(err.message, { error: err, request: req })
  Sentry.captureException(err)

  res.status(err.status || 500).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

