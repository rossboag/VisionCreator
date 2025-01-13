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
    const { componentName, code } = req.body

    await versionControl.initialize()

    await versionControl.createBackup(
      componentName,
      code,
      session.user.email || 'unknown'
    )

    const componentsDir = path.join(process.cwd(), v0Config.componentsDir)
    await fs.mkdir(componentsDir, { recursive: true })

    const fileName = `${componentName}.tsx`
    const filePath = path.join(componentsDir, fileName)
    await fs.writeFile(filePath, code)

    res.status(200).json({ message: 'Component deployed successfully' })
  } catch (error) {
    console.error('Error deploying component:', error)
    res.status(500).json({ message: 'Error deploying component' })
  }
}

