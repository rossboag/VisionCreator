import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export function OpenAIExample() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await res.json()
      setResponse(data.text)
    } catch (error) {
      console.error('Error:', error)
      setResponse('An error occurred while processing your request.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Example</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="mb-4"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="mt-4">
          <h3 className="font-semibold">Response:</h3>
          <p>{response}</p>
        </div>
      </CardFooter>
    </Card>
  )
}

