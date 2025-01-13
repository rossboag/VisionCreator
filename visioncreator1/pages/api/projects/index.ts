import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAllProjects, createProject } from '@/lib/projects'
import { handleApiError } from '@/lib/api-utils'
import { cacheGet, cacheSet, cacheDelete } from '@/lib/redis'
import { measurePerformance } from '@/lib/performance'

const CACHE_TTL = 60 * 5 // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    switch (req.method) {
      case 'GET':
        return await measurePerformance('GET /api/projects', async () => {
          const cachedProjects = await cacheGet('projects')
          if (cachedProjects) {
            return res.status(200).json(cachedProjects)
          }

          const projects = await getAllProjects()
          await cacheSet('projects', projects, CACHE_TTL)
          return res.status(200).json(projects)
        })

      case 'POST':
        return await measurePerformance('POST /api/projects', async () => {
          const newProject = await createProject(req.body)
          await cacheDelete('projects') // Invalidate cache
          return res.status(201).json(newProject)
        })

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return handleApiError(res, error)
  }
}

