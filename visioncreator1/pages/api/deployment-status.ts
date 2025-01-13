import { NextApiRequest, NextApiResponse } from 'next'
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const status = await redis.get('deployment_status')
      res.status(200).json({ status: status || 'No deployment in progress' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deployment status' })
    }
  } else if (req.method === 'POST') {
    try {
      const { status } = req.body
      await redis.set('deployment_status', status)
      res.status(200).json({ message: 'Deployment status updated' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to update deployment status' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

