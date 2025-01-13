import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getProjectById, updateProject, deleteProject } from '@/lib/projects'
import { handleApiError } from '@/lib/api-utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        const project = await getProjectById(id as string)
        if (!project) {
          return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json(project)

      case 'PUT':
        const updatedProject = await updateProject(id as string, req.body)
        return res.status(200).json(updatedProject)

      case 'DELETE':
        await deleteProject(id as string)
        return res.status(204).end()

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    return handleApiError(res, error)
  }
}

