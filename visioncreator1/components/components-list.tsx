'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ComponentCard } from './component-card'

interface Component {
  name: string
  lastModified: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalComponents: number
}

export function ComponentsList() {
  const [components, setComponents] = useState<Component[]>([])
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalComponents: 0,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchComponents(pagination.currentPage)
  }, [pagination.currentPage])

  useEffect(() => {
    const filtered = components.filter(component => 
      component.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredComponents(filtered)
  }, [searchQuery, components])

  const fetchComponents = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/v0-components?page=${page}`)
      if (!response.ok) {
        throw new Error('Failed to fetch components')
      }
      const data = await response.json()
      setComponents(data.components)
      setFilteredComponents(data.components)
      setPagination(data.pagination)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load components. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (componentName: string) => {
    router.push(`/admin/v0?edit=${componentName}`)
  }

  const handleDelete = async (componentName: string) => {
    if (confirm(`Are you sure you want to delete ${componentName}?`)) {
      try {
        const response = await fetch(`/api/admin/v0-components/${componentName}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete component')
        }
        toast({
          title: "Component deleted",
          description: `${componentName} has been deleted successfully.`,
        })
        fetchComponents(pagination.currentPage)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete component. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true">Loading components...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search components"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              aria-label="Search components"
            />
          </div>
        </div>
        <Table>
          <TableCaption>A list of your generated components</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Component Name</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComponents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No components found</TableCell>
              </TableRow>
            ) : (
              filteredComponents.map((component) => (
                <ComponentCard
                  key={component.name}
                  name={component.name}
                  lastModified={component.lastModified}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {(pagination.currentPage - 1) * 10 + 1} - {Math.min(pagination.currentPage * 10, pagination.totalComponents)} of {pagination.totalComponents} components
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
      </CardContent>
    </Card>
  )
}

