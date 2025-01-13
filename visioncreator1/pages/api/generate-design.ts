import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import OpenAI from 'openai'
import { z } from 'zod'
import rateLimit from '@/middleware/rateLimit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const requestSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(['image', 'video', 'text']),
  industry: z.string(),
  style: z.string(),
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const validatedData = requestSchema.parse(req.body)
    
    // Enhance the prompt based on the project details
    const enhancedPrompt = `Create a ${validatedData.style} ${validatedData.type} design for the ${validatedData.industry} industry. Title: ${validatedData.title}. Description: ${validatedData.description}`

    // Generate image using DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-2",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
    })

    if (!imageResponse.data[0].url) {
      throw new Error('No image URL received from OpenAI')
    }

    // Generate design description using GPT
    const descriptionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides brief descriptions of designs and suggests improvements."
        },
        {
          role: "user",
          content: `Analyze this design prompt and provide: 1) A brief description of the generated design, 2) Three suggested improvements or variations. Prompt: ${enhancedPrompt}`
        }
      ],
    })

    const generatedDesign = {
      imageUrl: imageResponse.data[0].url,
      description: descriptionResponse.choices[0].message.content,
      metadata: {
        title: validatedData.title,
        type: validatedData.type,
        industry: validatedData.industry,
        style: validatedData.style,
        generatedAt: new Date().toISOString(),
      },
    }

    res.status(200).json(generatedDesign)
  } catch (error) {
    console.error('Error generating design:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors })
    }
    res.status(500).json({ message: 'Error generating design' })
  }
}

export default function rateLimitedHandler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve) => {
    rateLimit(req, res, () => {
      resolve(handler(req, res))
    })
  })
}

