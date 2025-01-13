import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

const popularTemplates = [
  { id: 1, name: 'Social Media Post', uses: 1245, thumbnail: '/placeholder.svg?height=60&width=60' },
  { id: 2, name: 'Newsletter', uses: 987, thumbnail: '/placeholder.svg?height=60&width=60' },
  { id: 3, name: 'Product Showcase', uses: 756, thumbnail: '/placeholder.svg?height=60&width=60' },
  { id: 4, name: 'Event Invitation', uses: 543, thumbnail: '/placeholder.svg?height=60&width=60' },
]

export function PopularTemplates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularTemplates.map((template) => (
            <div key={template.id} className="flex items-center space-x-4">
              <div className="relative w-16 h-16">
                <Image
                  src={template.thumbnail}
                  alt={template.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.uses} uses</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

