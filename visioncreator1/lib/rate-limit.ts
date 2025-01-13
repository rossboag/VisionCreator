import { NextApiRequest, NextApiResponse } from 'next'
import { RateLimiter } from 'limiter'

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
  fireImmediately: true,
})

export default async function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const remainingRequests = await limiter.removeTokens(1)
    res.setHeader('X-RateLimit-Limit', limiter.tokensPerInterval)
    res.setHeader('X-RateLimit-Remaining', remainingRequests)

    if (remainingRequests < 0) {
      res.status(429).json({ message: 'Too Many Requests' })
    } else {
      next()
    }
  } catch {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

