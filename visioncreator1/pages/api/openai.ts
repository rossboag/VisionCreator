import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' })
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
    })

    const text = response.data.choices[0].text?.trim() || 'No response generated.'
    res.status(200).json({ text })
  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ message: 'Error processing your request' })
  }
}

