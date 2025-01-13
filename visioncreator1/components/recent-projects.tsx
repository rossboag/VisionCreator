'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Project = {
  id: string
  title: string
  type: 'image' | 'video' | 'text'
  thumbnail: string
  createdAt: string
}

const mockProjects: Project[] = [
  { id: '1', title: 'Summer Sale Banner', type: 'image', thumbnail: '/placeholder.svg?height=100&width=100', createdAt: '2023-06-15T10:00:00Z' },
  { id: '2', title: 'Product Showcase Video', type: 'video', thumbnail: '/placeholder.svg?height=100&width=100', createdAt: '2023-06-14T15:30:00Z' },
  { id: '3', title: 'Newsletter Template', type: 'text', thumbnail: '/placeholder.svg?height=100&width=100', createdAt: '2023-06-13T09:45:00Z' },
  { id: '4', title: 'Social Media Post', type: 'image', thumbnail: '/placeholder.svg?height=100&width=100', createdAt: '2023-06-12T14:20:00Z' },
]

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)

  const handleDelete = (id: string) => {
    setProjects(projects.filter(project => project.id !== id))
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="aspect-video relative mb-2">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h3 className="font-semibold truncate">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

