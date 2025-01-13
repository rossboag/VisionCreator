import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { title, type, imageUrl, description, metadata } = req.body

      const project = await prisma.project.create({
        data: {
          title,
          type,
          imageUrl,
          description,
          metadata,
          userId: session.user.id,
        },
      })

      res.status(201).json(project)
    } catch (error) {
      console.error('Error saving project:', error)
      res.status(500).json({ message: 'Error saving project' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

