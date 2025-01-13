import { NextApiResponse } from 'next'

export function handleApiError(res: NextApiResponse, error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return res.status(500).json({ message: error.message })
  }
  
  return res.status(500).json({ message: 'An unexpected error occurred' })
}

