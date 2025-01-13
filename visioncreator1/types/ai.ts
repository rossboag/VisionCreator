export interface DesignGenerationOptions {
  prompt: string
  size: '256x256' | '512x512' | '1024x1024'
  complexity: number
  useColor: boolean
  style?: 'realistic' | 'artistic' | 'minimalist' | 'abstract'
}

export interface GeneratedDesign {
  imageUrl: string
  designDescription: string
  colorPalette: string[]
  designElements: string[]
  metadata: {
    prompt: string
    size: string
    complexity: number
    useColor: boolean
    style?: string
    generatedAt: string
  }
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

