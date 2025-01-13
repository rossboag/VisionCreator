import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Save, Share2 } from 'lucide-react'
import Image from 'next/image'

interface GeneratedDesign {
  imageUrl: string
  description: string
  metadata: {
    title: string
    type: string
    industry: string
    style: string
    generatedAt: string
  }
}

interface AIDesignPreviewProps {
  design: GeneratedDesign | null
  onSave: () => void
  isSaving: boolean
}

export function AIDesignPreview({ design, onSave, isSaving }: AIDesignPreviewProps) {
  if (!design) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Design</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96 bg-muted">
          <p className="text-muted-foreground">Generate a design to see the preview</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Design</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video">
          <Image
            src={design.imageUrl}
            alt="AI-generated design"
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-muted-foreground">{design.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Metadata</h3>
          <ul className="text-sm text-muted-foreground">
            <li>Title: {design.metadata.title}</li>
            <li>Type: {design.metadata.type}</li>
            <li>Industry: {design.metadata.industry}</li>
            <li>Style: {design.metadata.style}</li>
            <li>Generated: {new Date(design.metadata.generatedAt).toLocaleString()}</li>
          </ul>
        </div>
        <div className="flex justify-between">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

