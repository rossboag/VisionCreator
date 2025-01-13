import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { v0Config } from '@/lib/v0-config'
import { ComponentVersionControl } from '@/lib/component-version-control'

const versionControl = new ComponentVersionControl(v0Config.backupDir)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user?.role === 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { componentName } = req.query
    const versions = await versionControl.getVersions(componentName as string)
    res.status(200).json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    res.status(500).json({ message: 'Error fetching versions' })
  }
}

