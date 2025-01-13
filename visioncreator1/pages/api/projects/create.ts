import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { z } from 'zod'
import { createProject } from '@/lib/projects'
import { handleApiError } from '@/lib/api-utils'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  imageUrl: z.string().url('Invalid image URL'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const validatedData = projectSchema.parse(req.body)
    const project = await createProject({
      ...validatedData,
      userId: session.user.id,
    })

    res.status(201).json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors })
    }
    return handleApiError(res, error)
  }
}

