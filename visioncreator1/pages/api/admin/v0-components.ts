import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import fs from 'fs/promises'
import path from 'path'
import { v0Config } from '@/lib/v0-config'

const ITEMS_PER_PAGE = 10

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (session?.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const page = parseInt(req.query.page as string) || 1
    const componentsDir = path.join(process.cwd(), v0Config.componentsDir)
    const files = await fs.readdir(componentsDir)
    
    const totalComponents = files.length
    const totalPages = Math.ceil(totalComponents / ITEMS_PER_PAGE)

    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    const components = await Promise.all(files.slice(startIndex, endIndex).map(async (file) => {
      const filePath = path.join(componentsDir, file)
      const stats = await fs.stat(filePath)
      return {
        name: path.parse(file).name,
        lastModified: stats.mtime,
      }
    }))

    res.status(200).json({
      components,
      pagination: {
        currentPage: page,
        totalPages,
        totalComponents,
      }
    })
  } catch (error) {
    console.error('Error fetching components:', error)
    res.status(500).json({ message: 'Error fetching components' })
  }
}

