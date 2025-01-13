import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Share2, Clock, Palette } from 'lucide-react'
import { GeneratedDesign } from '@/types/ai'

interface AIOutputProps {
  design: GeneratedDesign
}

export function AIOutput({ design }: AIOutputProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = design.imageUrl
    link.download = `design-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'AI Generated Design',
        text: design.designDescription,
        url: design.imageUrl,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Design</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative w-full h-[512px]">
          <Image
            src={design.imageUrl}
            alt={design.designDescription}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">{design.designDescription}</p>

          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Color Palette
            </h4>
            <div className="flex space-x-2">
              {design.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Design Elements</h4>
            <ul className="list-disc list-inside space-y-1">
              {design.designElements.map((element, index) => (
                <li key={index} className="text-muted-foreground">
                  {element}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            Generated on {new Date(design.metadata.generatedAt).toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

