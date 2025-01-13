import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface ProjectCardProps {
  id: string
  name: string
  description: string
  imageUrl: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ProjectCard({ id, name, description, imageUrl, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="aspect-video relative mb-4">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

