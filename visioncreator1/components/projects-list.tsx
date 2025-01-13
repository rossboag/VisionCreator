'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useDebounce } from '@/hooks/use-debounce'
import { ProjectCard } from './project-card'
import { ProjectCardSkeleton } from './project-card-skeleton'

interface Project {
  id: string
  name: string
  description: string
  imageUrl: string
  lastModified: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalProjects: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const { data, error, mutate } = useSWR<{ projects: Project[], pagination: PaginationInfo }>(
    `/api/projects?page=${currentPage}&search=${debouncedSearchQuery}`,
    fetcher
  )
  const router = useRouter()
  const { toast } = useToast()

  const handleEdit = (projectId: string) => {
    router.push(`/projects/${projectId}/edit`)
  }

  const handleDelete = async (projectId: string) => {
    if (confirm(`Are you sure you want to delete this project?`)) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete project')
        }
        mutate() // Revalidate the data
        toast({
          title: "Project deleted",
          description: `The project has been deleted successfully.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const renderProjects = () => {
    if (error) {
      return <div>Failed to load projects</div>
    }

    if (!data) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      )
    }

    const { projects, pagination } = data

    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
              imageUrl={project.imageUrl}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {(pagination.currentPage - 1) * 10 + 1} - {Math.min(pagination.currentPage * 10, pagination.totalProjects)} of {pagination.totalProjects} projects
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              aria-label="Search projects"
            />
          </div>
        </div>
        {renderProjects()}
      </CardContent>
    </Card>
  )
}

