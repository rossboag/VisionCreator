import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import fs from 'fs/promises'
import path from 'path'
import { v0Config } from '@/lib/v0-config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session?.user?.role === 'admin') {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { componentName } = req.query

  try {
    const componentsDir = path.join(process.cwd(), v0Config.componentsDir)
    const filePath = path.join(componentsDir, `${componentName}.tsx`)
    
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    // Here you would typically use a tool like Babel to transform the TSX to JS
    // and then wrap it in some HTML to make it renderable. For simplicity, we'll
    // just wrap it in a basic HTML structure.
    const preview = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${fileContent}
            ReactDOM.render(<${componentName} />, document.getElementById('root'));
          </script>
        </body>
      </html>
    `

    res.status(200).json({ preview })
  } catch (error) {
    console.error('Error generating preview:', error)
    res.status(500).json({ message: 'Error generating preview' })
  }
}

