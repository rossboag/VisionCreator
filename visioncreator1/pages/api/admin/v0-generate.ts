import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { v0Client, v0Config } from '@/lib/v0-config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (session?.user?.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { prompt, componentName, description } = req.body

    const result = await v0Client.generate({
      prompt,
      name: componentName,
      description,
    })

    res.status(200).json({
      code: result.code,
      preview: result.preview,
      componentName,
    })
  } catch (error) {
    console.error('Error generating component:', error)
    res.status(500).json({ message: 'Error generating component' })
  }
}

