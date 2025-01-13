'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface ComponentPreviewProps {
  componentName: string
}

export function ComponentPreview({ componentName }: ComponentPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchComponentPreview()
  }, [componentName])

  const fetchComponentPreview = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/v0-components/${componentName}/preview`)
      if (!response.ok) {
        throw new Error('Failed to fetch component preview')
      }
      const data = await response.json()
      setPreview(data.preview)
    } catch (error) {
      setError('Failed to load component preview. Please try again.')
      toast({
        title: "Error",
        description: "Failed to load component preview. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Loading preview...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!preview) {
    return <div>No preview available</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview: {componentName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-background p-4">
          <iframe
            srcDoc={preview}
            className="w-full min-h-[400px] rounded-md"
            title={`${componentName} Preview`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

