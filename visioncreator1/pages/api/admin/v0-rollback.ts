import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import fs from 'fs/promises'
import path from 'path'
import { v0Config } from '@/lib/v0-config'
import { ComponentVersionControl } from '@/lib/component-version-control'

const versionControl = new ComponentVersionControl(v0Config.backupDir)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user?.role === 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { componentName, versionId } = req.body

    const version = await versionControl.rollback(componentName, versionId)
    
    if (!version) {
      return res.status(404).json({ message: 'Version not found' })
    }

    const fileName = `${componentName}.tsx`
    const filePath = path.join(process.cwd(), v0Config.componentsDir, fileName)
    await fs.writeFile(filePath, version.code)

    await versionControl.createBackup(
      componentName,
      version.code,
      `${session.user.email} (rollback to ${version.id})`
    )

    res.status(200).json(version)
  } catch (error) {
    console.error('Error rolling back component:', error)
    res.status(500).json({ message: 'Error rolling back component' })
  }
}

